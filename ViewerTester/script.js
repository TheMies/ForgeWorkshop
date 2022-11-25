var viewer;
var options = {
    env: 'AutodeskProduction2',
    api: 'streamingV2',  // for models uploaded to EMEA change this option to 'streamingV2_EU'
    getAccessToken: function(onTokenReady) {
        var token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJCR3JQWlBHaWFZV3VkY0F0QmVkTHhrQUdDQ3RLVU1ZeCIsImlzcyI6Imh0dHBzOi8vZGV2ZWxvcGVyLmFwaS5hdXRvZGVzay5jb20iLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbSIsImp0aSI6Ik5uMlRzcU5WVWx3WFpkNkFiZ3pKTnJaTlRjb1RjV1IwdzRndlMySkhQc1hlb0NTTnBUWHQ1R05XZlpjQUM1d3ciLCJ1c2VyaWQiOiI5UVlIUjk4MkRLTjMiLCJleHAiOjE2NjkzNzQwOTh9.Ia6udjzTpiXGLbq1anpWp_oDmaiJDKj9s4Mk5uBqocaxdY9vhV_GU2tilydZGc1N9m5dTUhqAzhc0G8cAvUgFJuOfsqMNWDnAnzSZIHq29KHAm4RvSKMv7Z_Gdrd7nORusA5j4hV14el2-kGgZFrGjOHtp6LTQIigN7XF86CWFYt0eDtOIJMU0dw4AEu8LAM1n06O2NvG04-lgIXJVbuUVMbv-09VzmfBlgMkTBzvaWMLBxjMAr0Zb0rV75iaNRrlf9NWLAciJNsW5LymdGRzfbDf4WNJZgSYi0B-fafIZZRmZT6oMfg_nqzf5Z46lGcQU0srm80Vxwtwqh4pJkKEg";
        var timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
        onTokenReady(token, timeInSeconds);
    }
};

Autodesk.Viewing.Initializer(options, function() {

    var htmlDiv = document.getElementById('forgeViewer');
    viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
    var startedCode = viewer.start();
    if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
    }

    console.log('Initialization complete, loading a model next...');
    var htmlDiv = document.getElementById('forgeViewer');
    viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, {});
    viewer.start();

    var documentId = 'urn:dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLndTOEh2djY2UzB1cUdCQzNITUF3c0E_dmVyc2lvbj0x';
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
});


function onDocumentLoadSuccess(viewerDocument) {
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(viewerDocument, defaultModel);
}

function onDocumentLoadFailure() {
    console.error('Failed fetching Forge manifest');
}
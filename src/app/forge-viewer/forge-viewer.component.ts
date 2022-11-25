import { AfterViewInit, Component, Input, OnDestroy, Renderer2 } from '@angular/core';
declare const Autodesk: any;

@Component({
  selector: 'daqs-forge-viewer',
  templateUrl: './forge-viewer.component.html',
  styleUrls: ['./forge-viewer.component.css'],
})
export class ForgeViewerComponent implements OnDestroy, AfterViewInit {
  private viewer: any;

  private _documentId: string = '';

  public get documentId(): string {
    return this._documentId;
  }

  @Input()
  public set documentId(value: string) {
    this._documentId = value;
    if (this.viewer) {
      this.loadDocument(value);
    }
  }

  public loadDocument(urn: string) {
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(
      documentId,
      (viewerDocument: any) => this.onDocumentLoadSuccess(viewerDocument),
      () => this.onDocumentLoadFailure()
    );
  }

  @Input() public options = {
    env: 'AutodeskProduction2',
    api: 'streamingV2', // for models uploaded to EMEA change this option to 'streamingV2_EU'
    getAccessToken: function (
      onTokenReady: (token: string, timeInSeconds: number) => void
    ) {
      var token =
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJCR3JQWlBHaWFZV3VkY0F0QmVkTHhrQUdDQ3RLVU1ZeCIsImlzcyI6Imh0dHBzOi8vZGV2ZWxvcGVyLmFwaS5hdXRvZGVzay5jb20iLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbSIsImp0aSI6InFXVXl4VUhMNXhhTUJkbkVXZ3lZS05JUHlyN211SGZDSnN0OElCYkdhRTJDM3NsdnQ5Qk5LWnV5SHFVMGFxVGYiLCJ1c2VyaWQiOiJSQ0hLTFVBS042WkwiLCJleHAiOjE2NjkyMDI4Mjh9.TnLNBsaHnA0mQtnnyiSKthOeCJIQK2E7y9nJP5v9CUfzcV23n831lOIeoL-pc8dmVVMGtYEpMrfhq1d9lIZCwkQRT0gOx_Uq52ePl6X1ngVBbBT6Buem_8ZvwNsac0o032_44E-s8I7L3JKamVUAVa8OLEKJeIkjFtESHt9P2cfaTy0qJZqRFedQGJtJaXS2sDz_Vqg0BFQ4kFfxoPLlxc-OgCeNwur30tCSpCx59K7VFRwTi75rhYKMMOMH3jWEmX5k8o7fyunkdHaA4rcCmCAE7rsG-arTa4IXGn09lGBtF3aPbVBfUhfMLEhaJCKe3hrVJgOHQmLpNV56fGXACg';
      var timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
      onTokenReady(token, timeInSeconds);
    },
  };

  constructor(private renderer: Renderer2) { }

  public ngAfterViewInit(): void {
    this.ensureViewerLoaded().then(() => {
      if (this.documentId) {
        this.loadDocument(this.documentId);
      }
    });
  }

  public loadScripts(): Promise<void> {
    return new Promise((resolve) => {
      if (!document.getElementById('forgeviewerstyling')) {
        const styling = this.renderer.createElement('link');
        styling.rel = 'stylesheet';
        styling.id = 'forgeviewerstyling';
        styling.href =
          'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
        this.renderer.appendChild(document.head, styling);
      }

      if (!document.getElementById('forgeviewerscript')) {
        const script = this.renderer.createElement('script');
        script.id = 'forgeviewerscript';
        script.src =
          'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';

        script.onload = () => {
          resolve();
        };
        this.renderer.appendChild(document.body, script);
      } else {
        resolve();
      }
    });
  }

  public ngOnDestroy() {
    if (this.viewer) {
      this.viewer.finish();
      this.viewer = null;
    }
    Autodesk.Viewing.shutdown();
  }

  private onDocumentLoadSuccess(viewerDocument: any): void {
    const defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    this.viewer.loadDocumentNode(viewerDocument, defaultModel);
  }

  private onDocumentLoadFailure() {
    console.error('Failed fetching Forge manifest');
  }

  private ensureViewerLoaded(): Promise<void> {
    return new Promise((resolve) => {
      this.loadScripts().then(() => {
        if (!this.viewer) {
          Autodesk.Viewing.Initializer(this.options, () => {
            const htmlDiv = document.getElementById(
              'forgeViewer'
            ) as HTMLElement;
            this.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
            const startedCode = this.viewer.start();
            if (startedCode > 0) {
              return;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }
}

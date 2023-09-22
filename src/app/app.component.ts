import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private ifRunning = false;
  progressAreaHTML = '';
  uploadedFiles: { name: string; size: string }[] = [];

  constructor(private http: HttpClient) {}

  onFormClick(): void {
    if (this.ifRunning) {
      alert('Please wait, another file is uploading...');
      return;
    }
    this.fileInput.nativeElement.click();
  }

  //canvas effect
  canvasEffectActive = false;
  toggleCanvasEffect() {
    this.canvasEffectActive = !this.canvasEffectActive;
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      let fileName = file.name;
      if (fileName.length >= 12) {
        const splitName = fileName.split('.');
        fileName = splitName[0].substring(0, 13) + '... .' + splitName[1];
      }
      this.uploadFile(file, fileName);
    }
  }
  identifier: string | null = null;

  uploadFile(file: File, name: string): void {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

    this.http
      .post<any>('http://localhost:3000/upload', formData, {
        headers,
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const fileLoaded = Math.floor((event.loaded / event.total) * 100);
            const fileTotal = Math.floor(event.total / 1000);
            const fileSize =
              fileTotal < 1024
                ? fileTotal + ' KB'
                : (event.loaded / (1024 * 1024)).toFixed(2) + ' MB';

            this.progressAreaHTML = `
            <li class="row">
              <i class='bx bx-file file__progress-icon'></i>
              <div class="content">
                <div class="details">
                  <span class="name">${name} • Uploading</span>
                  <span class="percent">${fileLoaded}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" style="width: ${fileLoaded}%"></div>
                </div>
              </div>
            </li>
          `;

            this.ifRunning = true;
          }
        } else if (event.type === HttpEventType.Response) {
          this.progressAreaHTML = '';

          const uploadedSize =
            file.size < 1024
              ? file.size + 'B'
              : (file.size / (1024 * 1024)).toFixed(2) + ' MB';

          // The uniqueIdentifier should be obtained from the response
          const uploadedFile = event.body; // Assuming the server returns the uploaded file object

          this.identifier = uploadedFile.uniqueIdentifier; // Set the identifier

          const uploadedHTML = `
          <li class="row">
            <div class="content upload">
              <i class='bx bx-file file__progress-icon'></i>
              <div class="details">
                <span class="name">${name} • Uploaded</span>
                <span class="size">${uploadedSize}</span>
              </div>
            </div>
            <i class='bx bx-check file__check-icon'></i>
          </li>
        `;

          this.uploadedFiles.unshift({ name, size: uploadedSize });
          this.ifRunning = false;
        }
      });
  }

  onUploadDoneClick(): void {
    if (this.identifier) {
      this.http
        .get<any>(`http://localhost:3000/generate-link/${this.identifier}`)
        .subscribe((response) => {
          const downloadLink = response.downloadLink;

          const downloadLinkElement = document.createElement('a');
          downloadLinkElement.href = downloadLink;
          downloadLinkElement.target = '_blank';

          downloadLinkElement.textContent = 'Download Link';
          downloadLinkElement.style.display = 'block';

          downloadLinkElement.click();
        });
    } else {
      console.error('Identifier is not set');
    }
  }
}

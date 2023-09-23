import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-done',
  templateUrl: './upload-done.component.html',
  styleUrls: ['./upload-done.component.css']
})
export class UploadDoneComponent {
  identifier: any;

  constructor(private http:HttpClient){}

  onUploadDoneClick(): void {
    if (this.identifier) {
      this.http
        .get<any>(`http://localhost:3000/generate-link/${this.identifier}`)
        .subscribe((response: { downloadLink: any; }) => {
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

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  constructor(private http: HttpService, private router: Router) {}

  @ViewChild('videoPlayer') videoPlayer: any;
  public uploadProgress: number = 0;
  public videos: Promise<string[]> = this.http.getVideos();
  public currentIndex: number= 0;

  ngAfterViewInit(): void {
    if (!this.http.isLoggedIn)
      this.router.navigate(["login"]);
  }

  uploadVideo(event: any): void {
    this.uploadProgress = 0;
    this.http.uploadVideo(event.target.files[0]).subscribe(
      (snapshot: any) => {
        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (this.uploadProgress === 100) {
          // Reload the page when the upload is complete
          window.location.reload();
        }
      },
      (error: any) => {
        console.error('Upload failed:', error);
      }
    );
  }

  logout(): void {
    this.http.logout();
    this.router.navigate(["login"]);
  }

  previousVideo() {
    this.currentIndex--;
    this.reloadVideo();
  }

  nextVideo() {
    this.currentIndex++;
    this.reloadVideo();
  }

  reloadVideo() {
    if (this.videoPlayer)
      this.videoPlayer.nativeElement.load();
  }
}

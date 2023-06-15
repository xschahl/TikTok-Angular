import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private router: Router
  ) {}

  private storageFolder = "videos";
  private task: AngularFireUploadTask | undefined;
  private downloadURL: Observable<string> | undefined;

  public get isLoggedIn(): boolean {
    return localStorage.getItem("user") != undefined;
  }

  public logout(): void {
    localStorage.removeItem("user");
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth
        .signInWithEmailAndPassword(email, password);
      this.afAuth.authState.subscribe((user: any) => {
        if (user) {
          localStorage.setItem("user", user.email);
          this.router.navigate(["home"]);
        }
      });
    } catch (error: any) {
      window.alert(error.message);
    }
  }

  public async register(email: string, password: string): Promise<void> {
    try {
      await this.afAuth
        .createUserWithEmailAndPassword(email, password);
      this.afAuth.authState.subscribe((user: any) => {
        if (user)
          this.router.navigate(["home"]);
      });
    } catch (error: any) {
      window.alert(error.message);
    }
  }

  public async getVideos(): Promise<string[]> {
    const videos: string[] = [];
    const videoRefs: any = await this.afStorage.ref(this.storageFolder).listAll().toPromise();
    for (const video of videoRefs.items) {
      try {
        const downloadURL = await video.getDownloadURL();
        videos.push(downloadURL);
      } catch (error) {
        // Handle any potential errors while retrieving the download URL
        console.error('Error getting download URL:', error);
      }
    }
    return videos;
  }

  public uploadVideo(file: any): Observable<firebase.default.storage.UploadTaskSnapshot | undefined> {
    const filePath = `videos/${file.name}`;
    const fileRef = this.afStorage.ref(filePath);
    this.task = this.afStorage.upload(filePath, file);

    return this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
      }),
    );
  }
}

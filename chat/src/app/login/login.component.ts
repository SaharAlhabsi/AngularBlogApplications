import { Component, OnInit, HostBinding, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import "rxjs/add/operator/map";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,
    AngularFireModule
  ]
})

// angularfire2 docs
// https://github.com/angular/angularfire2/blob/master/src/auth/auth.ts
export class LoginComponent implements OnInit {

  public user: Observable<firebase.User>;
  public items: FirebaseListObservable<any[]>;
  public messageValue: string = ''; 
  public userUid; 
  public userName;
  public colorArray = ['red', 'orange', 'green', 'blue']; 
  public color = 'red'; 
  public progressVal: number = 0; 
  public image;
  public imageUrl: FirebaseListObservable<any[]>;
  public imageList; 
  public display = 'block'; 
  public loading = 'none'; 
  public placeholder; 
  public upload = 'Upload'; 
  public imageUrlArray = []; 

  constructor(public af: AngularFireAuth, public db: AngularFireDatabase) {
    // Firebase Authentication 
    this.user = af.authState;
    this.af.authState.subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.userName = auth.displayName;
        this.imageUrl = this.db.list('/photos', {
          query: {
            orderByChild: "date",
            limitToLast: 20,
          } 
        });
        // image URL's are stored in firebase realtime database
        // then used to retrive the images that are stored in
        // firebase storage 
        this.imageUrl.subscribe( 
          item => {
            let i = 0; 
            item.forEach(items => {
              let strRef = firebase.storage().ref().child('photos/' + items.imageUrl);
              strRef.getDownloadURL().then(url => {
                  this.imageUrlArray[i] = url;
                  i++; 
              }); 
            }); 
          });
      } else {
        console.log('not logged in'); 
      }
    });
   }

  ngOnInit() {
    // chat list observable 
    this.items = this.db.list('/item', {
      query: {
        orderByChild: "date",
        limitToLast: 5,
      }
    });
  }

  login() { 
    let size = this.colorArray.length;
    this.getRandomColor(0,size); 
    this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // reset user information
    this.af.authState.subscribe(auth => {
      this.userUid = auth.uid;
      this.userName = auth.email;
    });
  }

  logout() {
    this.af.auth.signOut();
  }

  sendData(item: string) {
    // push user input to 
    // used for the chat feature
    this.items.push({
      message: item,
      name:this.userName
    });

    this.messageValue = '';
  }

  fileButton(event) {
    this.display = 'none'; 
    this.loading = 'block';

    // get file
    let file = event.target.files[0]; 

    // create a storage ref
    let storageRef = firebase.storage().ref('photos/' + file.name); 

    // upload file
    let task = storageRef.put(file); 

    // update progress bar
    task.on(firebase.storage.TaskEvent.STATE_CHANGED, 
      (snapshot) => {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.progressVal = percentage; 
      },
      (error) => {
        console.log('Error Saving date to firebase storage.');
      },
      
      () => {
        console.log('Firebase Storage data save success.');
        this.upload = 'Success!';
        // store file metadata 
        // used for firebase storage download
        this.imageUrl.push({imageUrl: file.name, name: this.userName}); 
        this.display = 'block'; 
        this.upload = 'Upload'; 
        this.loading = 'none'; 
        this.progressVal = 0;  
      });
  }

  getRandomColor(top, bottom) { 
    // random color for chat ul li
    let rand = Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
    this.color = this.colorArray[rand]; 
  }
}
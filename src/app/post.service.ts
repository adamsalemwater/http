import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject, tap } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn:'root'})
export class PostService {
  error = new Subject<string>();

    constructor (private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title:title, content:content};
        this.http.post<{name: string}>(
            'https://angular-project-6b7a6-default-rtdb.firebaseio.com/posts.json', postData,
            {
              observe: 'response'
            }).
            subscribe((responseData) => {
              console.log(responseData);
            }, error => {
              this.error.next(error.message)
            });
            }

    fetchPost() {
        return this.http.
        get('https://angular-project-6b7a6-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Yo'}),
          params: new HttpParams().set('custom','key'),
          responseType: 'json'
        }).
    pipe(
      map(responseData => {
      const getArray: Post[] = []
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          getArray.push({...responseData[key], id: key});
        }
      }
     return getArray;
    })
    )
  }

  deletePost() {
    return this.http.delete(
      'https://angular-project-6b7a6-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }).
    pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    }))
  }
 }
  
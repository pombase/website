import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, of } from 'rxjs';
import { retryWhen, delay, take, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

const RETRY_DELAY = 3000;
const RETRY_COUNT = 10;
const REQUEST_TIMEOUT = 60000;

export class RetryOptions {
  constructor(public retryDelay: number,
              public retryCount: number,
              public requestTimeout: number) {};
}

@Injectable({
  providedIn: 'root'
})
export class HttpRetryService {

  constructor(private http: Http) {

  }

  // if a request fails, retry it RETRY_COUNT times but delay RETRY_DELAY
  // milliseconds between tries
  // if a request hangs, timeout after REQUEST_TIMEOUT milliseconds
  getWithRetry(url: string, options: RetryOptions = null): Observable<Response> {
    if (options == null) {
      options = new RetryOptions(RETRY_DELAY, RETRY_COUNT, REQUEST_TIMEOUT);
    }
    return this.http.get(url)
      .pipe(
        retryWhen((errors) => {
        return errors
          .mergeMap((error) => {
            if (error.status === 404) {
              return throwError(error);
            } else {
              return of(error);
            }
          })
          .pipe(delay(options.retryDelay), take(options.retryCount));
       }),
       timeout(options.requestTimeout)
      );
  }

}

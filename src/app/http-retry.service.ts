import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retryWhen, delay, take, timeout, mergeMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const RETRY_DELAY = 3000;
const RETRY_COUNT = 10;
const REQUEST_TIMEOUT = 60000;

export class RetryOptions {
  constructor(public responseType: string,
              public retryDelay: number = RETRY_DELAY,
              public retryCount: number = RETRY_COUNT,
              public requestTimeout: number = REQUEST_TIMEOUT) { };
}

@Injectable({
  providedIn: 'root'
})
export class HttpRetryService {

  constructor(private http: HttpClient) {

  }

  // if a request fails, retry it RETRY_COUNT times but delay RETRY_DELAY
  // milliseconds between tries
  // if a request hangs, timeout after REQUEST_TIMEOUT milliseconds
  getWithRetry(url: string, options: RetryOptions = null): Observable<HttpResponse<any>> {
    if (options == null) {
      options = new RetryOptions('json');
    }
    let getOptions: Object;
    if (options.responseType === 'json') {
      getOptions = { responseType: 'json' };
    } else {
      getOptions = { responseType: 'text' };
    }
    return this.http.get<any>(url, getOptions)
      .pipe(
        retryWhen((errors) => {
          return errors
            .pipe(
              mergeMap((error) => {
                if (error.status === 404) {
                  return throwError(error);
                } else {
                  return of(error);
                }
              }),
              delay(options.retryDelay),
              take(options.retryCount),
              mergeMap(err => throwError(`server access failed after ${options.retryCount} retries, error: ${err}`))
            )
        }),
        timeout(options.requestTimeout),
        catchError(e => throwError(e))
      );
  }

}

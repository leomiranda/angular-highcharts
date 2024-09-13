import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
    
export class DataService{

    constructor(private httpClient: HttpClient) {}

    public getData(){
        const url = `assets/data/mock-data.json`
        return this.httpClient.get<Response>(url).pipe(
            map(this.extractData),
            catchError(this.handleError)
        )
    }

    private extractData(res: Response){
        let body = res
        return body || {};
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error("An error occurred:", error.error.message);
        } else {
          // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` + `body was: ${error.error}`
          );
        }
        // return an observable with a user-facing error message
        return throwError(error);
      }

}
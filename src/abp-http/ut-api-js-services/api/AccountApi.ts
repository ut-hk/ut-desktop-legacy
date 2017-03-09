/**
 * UniTime.WebApi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { Http, Headers, URLSearchParams }                    from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType }                     from '@angular/http';

import { Observable }                                        from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models                                           from '../model/models';
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class AccountApi {
    protected basePath = 'http://unitime-dev-api.azurewebsites.net';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();

    constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
    }

    /**
     * 
     * 
     * @param logInInput 
     */
    public accountAuthenticate(logInInput: models.LogInInput, extraHttpRequestParams?: any): Observable<models.AjaxResponse> {
        return this.accountAuthenticateWithHttpInfo(logInInput, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }


    /**
     * 
     * 
     * @param logInInput 
     */
    public accountAuthenticateWithHttpInfo(logInInput: models.LogInInput, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/api/Account`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'logInInput' is not null or undefined
        if (logInInput === null || logInInput === undefined) {
            throw new Error('Required parameter logInInput was null or undefined when calling accountAuthenticate.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json', 
            'text/json', 
            'application/x-www-form-urlencoded'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json', 
            'text/json'
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: logInInput == null ? '' : JSON.stringify(logInInput), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}

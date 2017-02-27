/**
 * ProjectIntelligence.WebApi
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
import { BASE_PATH }                                         from '../variables';
import { Configuration }                                     from '../configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class App_projectNotificationApi {
    protected basePath = 'http://pi-dev-api.azurewebsites.net';
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
     * Extends object by coping non-existing properties.
     * @param objA object to be extended
     * @param objB source object
     */
    private extendObj<T1,T2>(objA: T1, objB: T2) {
        for(let key in objB){
            if(objB.hasOwnProperty(key)){
                (objA as any)[key] = (objB as any)[key];
            }
        }
        return <T1&T2>objA;
    }

    /**
     * 
     * 
     * @param input 
     */
    public appProjectNotificationGetFileNotifications(input: models.GetProjectNotificationsInput, extraHttpRequestParams?: any): Observable<models.GetFileNotificationsOutput> {
        return this.appProjectNotificationGetFileNotificationsWithHttpInfo(input, extraHttpRequestParams)
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
     * @param input 
     */
    public appProjectNotificationGetFolderNotifications(input: models.GetProjectNotificationsInput, extraHttpRequestParams?: any): Observable<models.GetFolderNotificationsOutput> {
        return this.appProjectNotificationGetFolderNotificationsWithHttpInfo(input, extraHttpRequestParams)
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
     * @param input 
     */
    public appProjectNotificationGetFileNotificationsWithHttpInfo(input: models.GetProjectNotificationsInput, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/api/services/app/projectNotification/GetFileNotifications`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'input' is not null or undefined
        if (input === null || input === undefined) {
            throw new Error('Required parameter input was null or undefined when calling appProjectNotificationGetFileNotifications.');
        }


        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
        ];
        
            

        headers.set('Content-Type', 'application/json');


        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: input == null ? '' : JSON.stringify(input), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });
        
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * 
     * 
     * @param input 
     */
    public appProjectNotificationGetFolderNotificationsWithHttpInfo(input: models.GetProjectNotificationsInput, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/api/services/app/projectNotification/GetFolderNotifications`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'input' is not null or undefined
        if (input === null || input === undefined) {
            throw new Error('Required parameter input was null or undefined when calling appProjectNotificationGetFolderNotifications.');
        }


        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
        ];
        
            

        headers.set('Content-Type', 'application/json');


        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: input == null ? '' : JSON.stringify(input), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });
        
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}

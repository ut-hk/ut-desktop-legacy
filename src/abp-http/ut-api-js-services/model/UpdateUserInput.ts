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

import * as models from './models';

export interface UpdateUserInput {
    operationRole?: UpdateUserInput.OperationRoleEnum;

    password?: string;

    id?: number;

}
export namespace UpdateUserInput {
    export enum OperationRoleEnum {
        NUMBER_10 = <any> 10,
        NUMBER_50 = <any> 50,
        NUMBER_100 = <any> 100
    }
}
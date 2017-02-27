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

export interface SubmissionFolderLightDto {
    overallStatus?: SubmissionFolderLightDto.OverallStatusEnum;

    name?: string;

    type?: SubmissionFolderLightDto.TypeEnum;

    depth?: number;

    id?: string;

}
export namespace SubmissionFolderLightDto {
    export enum OverallStatusEnum {
        NUMBER_0 = <any> 0,
        NUMBER_200 = <any> 200,
        NUMBER_300 = <any> 300,
        NUMBER_400 = <any> 400
    }
    export enum TypeEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1,
        NUMBER_2 = <any> 2,
        NUMBER_3 = <any> 3
    }
}
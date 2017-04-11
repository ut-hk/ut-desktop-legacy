input/**
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

import * as models from './models';

export interface ActivityListDto {
    startTime?: Date;

    endTime?: Date;

    activityTemplateId?: string;

    name?: string;

    location?: models.LocationDto;

    tags?: Array<models.TagDto>;

    owner?: models.UserListDto;

    coverImageDescription?: models.DescriptionDto;

    coverTextDescription?: models.DescriptionDto;

    myRatingStatus?: ActivityListDto.MyRatingStatusEnum;

    likes?: number;

    id?: string;

}
export namespace ActivityListDto {
    export enum MyRatingStatusEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1
    }
}

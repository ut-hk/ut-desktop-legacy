import { TestBed, inject } from '@angular/core/testing';
import { AbpHttp } from './abp-http.service';

describe('AbpHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbpHttp]
    });
  });

  it('should ...', inject([AbpHttp], (service: AbpHttp) => {
    expect(service).toBeTruthy();
  }));
});

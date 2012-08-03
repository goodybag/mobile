/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"v8"] forKey:@"ti.android.runtime"];
    [_property setObject:[TiUtils stringValue:@"mfpKS7sp6AxZw2NEadHnqY4CaRudMLr7"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"D6szJfAvTzwUcPAJCdL6BkmUAHzBWG49"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"Fgg3h53Zw1vzFlC6Bu703jyvS7ctMj2c"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"BbVi1nwMQfDxiuFoJpZGfVHPlMIjH5Xr"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"0CwYu23xxazTzddfTGbRXWxt8Uw6J3Yi"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"jvnFGkayWrzHMaJdz1HETgQ8fh9E8dF8"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"152282721508707"] forKey:@"ti.facebook.appid"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];
    [_property setObject:[TiUtils stringValue:@"0paDZmV0rlfWwU9_rCTHFS2-IdKw1RhjYmFr1gQ"] forKey:@"ti.android.google.map.api.key.production"];

    return _property;
}
@end

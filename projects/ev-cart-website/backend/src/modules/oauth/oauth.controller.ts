import { Controller, Get, Query, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { OauthService } from './oauth.service'

@ApiTags('oauth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('wechat/callback')
  @ApiOperation({ summary: '微信登录回调' })
  wechatCallback(@Query('code') code: string) {
    return this.oauthService.wechatLogin(code)
  }

  @Get('qq/callback')
  @ApiOperation({ summary: 'QQ 登录回调' })
  qqCallback(@Query('code') code: string) {
    return this.oauthService.qqLogin(code)
  }

  @Get('alipay/callback')
  @ApiOperation({ summary: '支付宝登录回调' })
  alipayCallback(@Query('code') code: string) {
    return this.oauthService.alipayLogin(code)
  }

  @Post('bind')
  @ApiOperation({ summary: '绑定第三方账号' })
  bindAccount(
    @Body('userId') userId: string,
    @Body('platform') platform: 'wechat' | 'qq' | 'alipay',
    @Body('openid') openid: string,
  ) {
    return this.oauthService.bindAccount(userId, platform, openid)
  }

  @Post('unbind')
  @ApiOperation({ summary: '解绑第三方账号' })
  unbindAccount(
    @Body('userId') userId: string,
    @Body('platform') platform: 'wechat' | 'qq' | 'alipay',
  ) {
    return this.oauthService.unbindAccount(userId, platform)
  }
}

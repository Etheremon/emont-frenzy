import React from "react"

import {Img} from "../../images/Images.jsx";
import {Icon} from "semantic-ui-react";

require("style-loader!./HelpBar.scss");


export const HelpBar = ({_t}) => {
  return (
    <div className={'help-bar'}>

      <div className={'help-bar__help'} onClick={() => {
        document.getElementsByClassName('help-bar__buttons')[0].classList.toggle('help-bar__buttons--show')
      }}>
        <Icon name={'life ring'} /><span>{_t('txt.help')}</span>
      </div>

      <div className={'help-bar__buttons'}>
        <a href={'https://discord.gg/umUNHvJ'} target={'_blank'}><img src={require('../../../../shared/img/icons/discord.png')}/></a>
        {/*<a href={'https://t.me/myetheremon'} target={'_blank'}><img src={require('../../../../shared/img/icons/telegram.png')}/></a>*/}
      </div>
    </div>
  );
};
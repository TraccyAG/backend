import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { Emails } from '@prisma/client';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
  constructor(private readonly prisma: PrismaService) {} // Inject the Prisma service

  async createEmail(data: Emails): Promise<Emails> {
    return this.prisma.emails.create({ data });
  }

  async sendMail(email: string, name: string) {
    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: 'info@traccy.ch', // Gmail email address
        pass: 'bscpzmcnclkbykzc', // Gmail password or App Password
      },
    });

    const mailOptions = {
      from: 'info@traccy.ch',
      to: email,
      subject: 'Traccy AG: Thank you for your message',
      html: `
<h2>Hello ${name}</h2>
<p>Thank you for your message. We are very pleased about your interest in our company.</p>
<p>We will process your request and will get back to you within 24 hours.</p>
<p>Until then, we recommend you take a look and subscribe to our social media.</p>
<p>There you will find the latest news about our company and more.</p>
<p>In case of urgent inquiries, please contact us by phone at +41 43 810 29 51 (Monday-Friday 09:00-18:00).</p>
<br>
<p>Kind regards</p>
<table border="0" cellspacing="0" cellpadding="0" width="836" style="width:626.95pt;border-collapse:collapse">
  <tbody>
  <tr style="height:11.5pt">
    <td width="198" colspan="2" rowspan="2" style="width:148.85pt;border:none;border-right:solid #8a108c 2.25pt;padding:0cm 5.4pt 0cm 5.4pt;height:11.5pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span><img width="173" height="38" id="m_-1430256717437431927Bild_x0020_1" src="https://portal.traccy.io/static/media/logo.5b267d8957c8c641526b.png"></span><span></span></p>
    </td>
    <td width="627" valign="top" style="width:470.35pt;padding:0cm 0cm 0cm 0cm;height:11.5pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-left:5.65pt">
        <span lang="FR-CH" style="font-size:12.0pt;font-family:&quot;Century Gothic&quot;,sans-serif">Traccy Team</span></p>
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-right:0cm;margin-bottom:1.0pt;margin-left:5.65pt">
<span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(138,16,140)">phone
</span><span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(64,64,64)">+41 43 810 29 51<b>
</b></span><span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(138,16,140)">email</span><span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(64,64,64)">
<a href="mailto:info@traccy.ch" target="_blank"><span style="font-size:11pt;font-family:Calibri,sans-serif;text-decoration:none;color:rgb(64,64,64)">info@traccy.ch</span></a>
</span><span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(138,16,140)">web</span><span lang="FR-CH" style="font-size:9.0pt;font-family:&quot;Century Gothic&quot;,sans-serif">
</span><span><a href="http://www.traccy.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.traccy.io/&amp;source=gmail&amp;ust=1687420067057000&amp;usg=AOvVaw33Xz_0TV0NDdChhYrAslMP"><span lang="FR-CH" style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;text-decoration:none;color:rgb(64,64,64)">www.traccy.io</span></a></span><span style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(64,64,64)">
</span><span lang="FR-CH" style="font-size:9.0pt;font-family:&quot;Century Gothic&quot;,sans-serif"></span></p>
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-right:0cm;margin-bottom:1.0pt;margin-left:5.65pt">
        <span style="font-size:9pt;font-family:&quot;Century Gothic&quot;,sans-serif;color:rgb(138,16,140)">adress</span><span style="font-size:9.0pt;font-family:&quot;Century Gothic&quot;,sans-serif">
<span style="color:rgb(64,64,64)">Chaltenbodenstrasse 6a, 8834 Schindellegi</span></span></p>
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-left:5.65pt">
        <span style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif">&nbsp;</span></p>
    </td>
    <td width="7" style="width:5.25pt;padding:0cm 0cm 0cm 0cm;height:11.5pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span><span></span></p>
    </td>
    <td width="3" style="width:2.5pt;padding:0cm 0cm 0cm 0cm;height:11.5pt"></td>
  </tr>
  <tr>
    <td width="627" valign="top" style="width:470.35pt;padding:0cm 5.4pt 0cm 5.4pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <a href="https://web.telegram.org/z/#-1897696749" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://web.telegram.org/z/%23-1897696749&amp;source=gmail&amp;ust=1687420067057000&amp;usg=AOvVaw38NmR12SPFEuYUKYU9TyYX"><span style="text-decoration:none;color:windowtext"><img border="0" width="15" height="15" id="m_-1430256717437431927Bild_x0020_2" src="https://mail.google.com/mail/u/0?ui=2&amp;ik=756f828b32&amp;attid=0.2&amp;permmsgid=msg-f:1769230532470185640&amp;th=188d91cba5a91ea8&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ_ciZZVYMka5MlVbn8Q4FR0YwVyR8BRLE9Ohl-FgNUzVT1vOtum9sKsyVMaWVowqmlkiJldj6HgWQ7x71BFVNgyQTxo7NHlnr2czHei9l5o0LW3QuM7FfUXQmQ&amp;disp=emb" style="width:.1583in;height:.1583in" data-image-whitelisted="" class="CToWUd" data-bit="iit"></span></a><span>&nbsp;&nbsp;&nbsp;</span><a href="https://twitter.com/home?lang=de" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/home?lang%3Dde&amp;source=gmail&amp;ust=1687420067057000&amp;usg=AOvVaw25fAvxK9_IpCcGZK05-Tjk"><span style="text-decoration:none;color:windowtext"><img border="0" width="16" height="14" id="m_-1430256717437431927Bild_x0020_3" src="https://mail.google.com/mail/u/0?ui=2&amp;ik=756f828b32&amp;attid=0.3&amp;permmsgid=msg-f:1769230532470185640&amp;th=188d91cba5a91ea8&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ9ProwXe5OiMxgllEIjkt3bhoPUl_fyDkDyfg9BDZ2JeVaiO7pTJ79TZvHgFIZAWb_1YNX--iyMpSRacmum-eRLwbbs_loHGN6ibYi1sm_WdTA1LIF7MW4T6-A&amp;disp=emb" style="width:.1666in;height:.15in" data-image-whitelisted="" class="CToWUd" data-bit="iit"></span></a><span>&nbsp;&nbsp;&nbsp;</span><a href="https://www.instagram.com/traccy_official/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/traccy_official/&amp;source=gmail&amp;ust=1687420067057000&amp;usg=AOvVaw0B-lNHwciw_YGnh5uHID6U"><span style="text-decoration:none;color:windowtext"><img border="0" width="14" height="14" id="m_-1430256717437431927Bild_x0020_4" src="https://mail.google.com/mail/u/0?ui=2&amp;ik=756f828b32&amp;attid=0.4&amp;permmsgid=msg-f:1769230532470185640&amp;th=188d91cba5a91ea8&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ949zbFDcULp6Vr_LuO58QH1qxjwECsAabuSclYoX8XslM2G4HgIVu2qcEi2IfpaNaoGxgGSV4jLrii4l_mZvy70sQ0orTrh6L9zu03EfyERFN01au1qwPDjm8&amp;disp=emb" style="width:.15in;height:.15in" data-image-whitelisted="" class="CToWUd" data-bit="iit"></span></a><span>&nbsp;&nbsp;&nbsp;</span><a href="https://www.linkedin.com/company/traccy-ag/?viewAsMember=true" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.linkedin.com/company/traccy-ag/?viewAsMember%3Dtrue&amp;source=gmail&amp;ust=1687420067057000&amp;usg=AOvVaw3PhSHiUXsZGTt6-9fU6Nfo"><span style="text-decoration:none;color:windowtext"><img border="0" width="14" height="15" id="m_-1430256717437431927Grafik_x0020_19" src="https://mail.google.com/mail/u/0?ui=2&amp;ik=756f828b32&amp;attid=0.5&amp;permmsgid=msg-f:1769230532470185640&amp;th=188d91cba5a91ea8&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ8Ac2lgW2ta23s-OO9FOg6jYoylGuIZWSTOvA1W61Oes5sQnMmS08YxDIQUqscDshljF_HwSLsCn0CJ4TTtZI4VtzjnGZy6pN-6LfPF0yBtcgBBYy0KuaO97S0&amp;disp=emb" style="width:.15in;height:.1583in" data-image-whitelisted="" class="CToWUd" data-bit="iit"></span></a><span></span></p>
    </td>
    <td width="7" style="width:5.25pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span><span></span></p>
    </td>
    <td width="3" style="width:2.5pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span></p>
    </td>
  </tr>
  <tr style="height:13.45pt">
    <td width="7" style="width:5.25pt;padding:0cm 0cm 0cm 0cm;height:13.45pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span></p>
    </td>
    <td width="826" colspan="3" rowspan="2" style="width:619.2pt;padding:0cm 0cm 0cm 0cm;height:13.45pt">
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span></p>
      <p class="MsoNormal" style="margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">
        <span><img border="0" width="826" height="140" id="m_-1430256717437431927Grafik_x0020_13" src="https://traccy.fra1.digitaloceanspaces.com/image006.jpg" data-tooltip-class="a1V" data-tooltip="Скачать"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div><div id=":nc" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Добавить файл &quot;image006.jpg&quot; на Диск" jslog="54185; u014N:cOuCgd,xr6bB; 1:WyIjdGhyZWFkLWY6MTc2OTIzMDUzMjQ3MDE4NTY0MCIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc2OTIzMDUzMjQ3MDE4NTY0MCIsbnVsbCxbXV0.; 43:WyJpbWFnZS9qcGVnIiwxMjUzNjZd" data-tooltip-class="a1V" data-tooltip="Добавить на Диск"><div class="akn"><div class="wtScjd J-J5-Ji aYr XG"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div><div id=":ne" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Сохранить копию в Фото" jslog="54186; u014N:cOuCgd,xr6bB; 1:WyIjdGhyZWFkLWY6MTc2OTIzMDUzMjQ3MDE4NTY0MCIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc2OTIzMDUzMjQ3MDE4NTY0MCIsbnVsbCxbXV0.; 43:WyJpbWFnZS9qcGVnIiwxMjUzNjZd" data-tooltip-class="a1V" data-tooltip="Сохранить копию в Фото"><div class="akn"><div class="J-J5-Ji aYr akS"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div></div></span><span></span></p>
    </td>
    <td width="3" style="width:2.5pt;padding:0cm 0cm 0cm 0cm;height:13.45pt"></td>
  </tr>
  <tr style="height:11.5pt">
    <td width="7" style="width:5.25pt;padding:0 0 0 0;height:11.5pt">
      <p class="MsoNormal" style="margin:0;font-size:11pt;font-family:Calibri,sans-serif">
        <span>&nbsp;</span><span></span></p>
    </td>
    <td width="3" style="width:2.5pt;padding:0 0 0 0;height:11.5pt"></td>
  </tr>
  <tr>
    <td width="7" style="width:5.25pt;padding:0 0 0 0"></td>
    <td width="269" style="width:201.75pt;padding:0 0 0 0"></td>
    <td width="550" style="width:412.5pt;padding:0 0 0 0"></td>
    <td width="7" style="width:5.25pt;padding:0 0 0 0"></td>
    <td width="3" style="width:2.25pt;padding:0 0 0 0"></td>
  </tr>
  </tbody>
</table>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
      } else {
        console.log('Reset password email sent:', info.response);
      }
    });
  }
}

import dotenv from "dotenv";
import { db, EmailTemplateConfig } from "./db";
dotenv.config();

export interface EmailResult {
  success: boolean;
  provider: "resend" | "sendgrid" | "simulated";
  messageId?: string;
  error?: string;
}

export interface AccessEmailOptions {
  toName: string;
  toEmail: string;
  password: string;
  accessCode?: string;
  appUrl?: string;
  productTitle?: string;
}

function replacePlaceholders(templateStr: string, vars: Record<string, string>): string {
  if (!templateStr) return "";
  let res = templateStr;
  for (const [k, v] of Object.entries(vars)) {
    const reg = new RegExp(`{{\\s*${k}\\s*}}`, "gi");
    res = res.replace(reg, v || "");
  }
  return res;
}

/**
 * Service to dispatch transactional emails via Resend or SendGrid APIs,
 * with customizable templates and clean fallback logging.
 */
export class EmailService {
  private static get resendApiKey(): string | undefined {
    return process.env.RESEND_API_KEY;
  }

  private static get sendGridApiKey(): string | undefined {
    return process.env.SENDGRID_API_KEY;
  }

  private static get senderEmail(): string {
    return process.env.EMAIL_FROM || "Membros <onboarding@resend.dev>";
  }

  private static get appUrl(): string {
    return process.env.APP_URL || "https://ais-pre-nwp4fjne5o7f7nha5t5vo7-585128603789.us-east1.run.app";
  }

  /**
   * Dispatch e-mail with access credentials (email, generated password, access code)
   */
  public static async sendAccessCredentials(options: AccessEmailOptions): Promise<EmailResult> {
    const { toName, toEmail, password, accessCode, productTitle } = options;
    const loginUrl = `${this.appUrl}`;

    // Get customized template from DB
    const template: EmailTemplateConfig = db.getEmailTemplate();

    const vars: Record<string, string> = {
      nome: toName,
      login: toEmail,
      email: toEmail,
      senha: password,
      codigo: accessCode || "",
      produto: productTitle || "Infoproduto",
      link_acesso: loginUrl
    };

    const subject = replacePlaceholders(template.subject, vars);
    const headerTitle = replacePlaceholders(template.headerTitle, vars);
    const headerSubtitle = replacePlaceholders(template.headerSubtitle, vars);
    const bodyGreeting = replacePlaceholders(template.bodyGreeting, vars);
    const bodyText = replacePlaceholders(template.bodyText, vars);
    const buttonText = replacePlaceholders(template.buttonText, vars);
    const footerText = replacePlaceholders(template.footerText, vars);

    const accentColor = template.accentColor || "#f59e0b";
    const isLight = template.theme === "light";
    const isModern = template.theme === "modern";

    const bgColor = isLight ? "#f8fafc" : "#090d16";
    const cardBg = isLight ? "#ffffff" : isModern ? "#0f172a" : "#0f172a";
    const cardBorder = isLight ? "#e2e8f0" : "#1e293b";
    const textColor = isLight ? "#1e293b" : "#f8fafc";
    const mutedColor = isLight ? "#64748b" : "#94a3b8";
    const boxBg = isLight ? "#f1f5f9" : "#020617";
    const boxBorder = isLight ? "#cbd5e1" : "#334155";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dados de Acesso</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${bgColor}; color: ${textColor}; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, ${cardBg} 0%, ${bgColor} 100%); padding: 32px 32px 24px 32px; border-bottom: 1px solid ${cardBorder}; text-align: center;">
            <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid ${accentColor}50; border-radius: 12px; padding: 8px 16px; margin-bottom: 12px;">
              <span style="color: ${accentColor}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Acesso Confirmado</span>
            </div>
            <h1 style="color: ${textColor}; font-size: 22px; font-weight: 800; margin: 0; padding: 0;">${headerTitle}</h1>
            <p style="color: ${mutedColor}; font-size: 14px; margin-top: 6px; margin-bottom: 0;">${headerSubtitle}</p>
          </div>

          <!-- Credentials Card -->
          <div style="padding: 32px;">
            ${bodyGreeting ? `<p style="color: ${textColor}; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">${bodyGreeting}</p>` : ""}
            <p style="color: ${mutedColor}; font-size: 14px; line-height: 1.6; margin-top: 0;">
              ${bodyText}
            </p>

            <div style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 16px; padding: 20px; margin: 24px 0;">
              <div style="margin-bottom: 16px;">
                <span style="color: ${mutedColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Seu E-mail / Login</span>
                <span style="color: ${accentColor}; font-size: 16px; font-weight: 700; font-family: monospace; word-break: break-all;">${toEmail}</span>
              </div>

              <div style="margin-bottom: ${accessCode ? "16px" : "0"};">
                <span style="color: ${mutedColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Sua Senha Inicial de Acesso</span>
                <span style="color: #34d399; font-size: 18px; font-weight: 800; font-family: monospace; background-color: ${cardBg}; padding: 6px 12px; border-radius: 8px; border: 1px solid ${cardBorder}; display: inline-block;">${password}</span>
              </div>

              ${accessCode ? `
              <div>
                <span style="color: ${mutedColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Código de Verificação de Primeiro Acesso</span>
                <span style="color: #22d3ee; font-size: 18px; font-weight: 800; font-family: monospace; background-color: ${cardBg}; padding: 6px 12px; border-radius: 8px; border: 1px solid ${cardBorder}; display: inline-block;">${accessCode}</span>
              </div>
              ` : ''}
            </div>

            <!-- Login CTA Button -->
            <div style="text-align: center; margin: 32px 0 24px 0;">
              <a href="${loginUrl}" target="_blank" style="background-color: ${accentColor}; color: #020617; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);">
                ${buttonText}
              </a>
            </div>

            <p style="color: ${mutedColor}; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
              Dica de segurança: Recomendamos que você altere sua senha no seu primeiro login nas configurações de perfil.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: ${boxBg}; padding: 20px; border-top: 1px solid ${cardBorder}; text-align: center;">
            <p style="color: ${mutedColor}; font-size: 11px; margin: 0;">
              ${footerText}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: toEmail,
      subject,
      html: htmlContent,
      text: `${bodyGreeting}\n\n${bodyText}\n\nLogin: ${toEmail}\nSenha: ${password}\n${accessCode ? `Código: ${accessCode}\n` : ''}Acesse em: ${loginUrl}`
    });
  }

  /**
   * Internal generic dispatcher checking Resend -> SendGrid -> Local simulation
   */
  public static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<EmailResult> {
    const { to, subject, html, text } = params;

    // 1. Try Resend API if API Key is configured
    if (this.resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: this.senderEmail,
            to: [to],
            subject: subject,
            html: html,
            text: text
          })
        });

        const resData: any = await response.json();

        if (response.ok) {
          console.log(`[EmailService] E-mail enviado com SUCESSO via Resend para ${to} (ID: ${resData.id})`);
          return {
            success: true,
            provider: "resend",
            messageId: resData.id
          };
        } else {
          console.error(`[EmailService] Falha na API do Resend:`, resData);
        }
      } catch (err: any) {
        console.error(`[EmailService] Erro ao conectar com Resend API:`, err?.message || err);
      }
    }

    // 2. Try SendGrid API if API Key is configured
    if (this.sendGridApiKey) {
      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.sendGridApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: "no-reply@infoprodutos.com.br", name: "Sistema de Membros" },
            subject: subject,
            content: [
              { type: "text/plain", value: text },
              { type: "text/html", value: html }
            ]
          })
        });

        if (response.ok || response.status === 202) {
          console.log(`[EmailService] E-mail enviado com SUCESSO via SendGrid para ${to}`);
          return {
            success: true,
            provider: "sendgrid"
          };
        } else {
          const errData = await response.text();
          console.error(`[EmailService] Falha na API SendGrid:`, errData);
        }
      } catch (err: any) {
        console.error(`[EmailService] Erro ao conectar com SendGrid API:`, err?.message || err);
      }
    }

    // 3. Fallback / Simulated mode with full console log output
    console.log(`\n=================================================`);
    console.log(`[SISTEMA DE E-MAIL AUTOMÁTICO (Simulação Ativa)]`);
    console.log(`De: ${this.senderEmail}`);
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(`-------------------------------------------------`);
    console.log(text);
    console.log(`=================================================\n`);

    return {
      success: true,
      provider: "simulated"
    };
  }
}

const commitmentPatterns = [
  /\bd[oö]nece(?:ğim|gim|ğiz|giz)\b/i,
  /\bd[oö]neyim\b/i,
  /\bbirazdan\b/i,
  /\bdaha sonra\b/i,
  /\bkontrol edip\b/i,
  /\baraştırıp\b/i,
  /\bbulup (?:size )?(?:yazacağım|ileteceğim|göndereceğim)\b/i,
  /\bhaber verece(?:ğim|gim|ğiz|giz)\b/i,
  /\biletip (?:size )?d[oö]nece(?:ğim|gim|ğiz|giz)\b/i,
];

const handoffPatterns = [
  /\byetkili(?:ye|mize)? (?:iletiyorum|aktarıyorum|haber veriyorum)\b/i,
  /\bsizi yetkili(?:ye|mize)? (?:aktarıyorum|yönlendiriyorum)\b/i,
];

export function containsCommitmentLanguage(text: string): boolean {
  return commitmentPatterns.some((pattern) => pattern.test(text));
}

export function containsHandoffLanguage(text: string): boolean {
  return handoffPatterns.some((pattern) => pattern.test(text));
}

export function validateOutboundMessage(input: {
  text: string;
  commitmentId?: string;
  openCommitmentIds: string[];
  hasPendingHandoff: boolean;
}): { ok: true } | { ok: false; reason: string } {
  if (containsCommitmentLanguage(input.text)) {
    if (!input.commitmentId || !input.openCommitmentIds.includes(input.commitmentId)) {
      return {
        ok: false,
        reason: "Bu mesaj geleceğe dönük söz içeriyor; önce açık iş oluşturulmalı ve commitment_id verilmelidir.",
      };
    }
  }

  if (containsHandoffLanguage(input.text) && !input.hasPendingHandoff) {
    return {
      ok: false,
      reason: "Bu mesaj yetkili devri sözü içeriyor; önce request_human aracı çalıştırılmalıdır.",
    };
  }

  return { ok: true };
}

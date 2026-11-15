import { describe, expect, it } from "vitest";
import {
  containsCommitmentLanguage,
  containsHandoffLanguage,
  validateOutboundMessage,
} from "./guardrails.js";

describe("outbound guardrails", () => {
  it.each([
    "Kontrol edip döneceğim.",
    "Birazdan size yazacağım.",
    "Araştırıp haber vereceğim.",
    "Ürünü bulup size göndereceğim.",
  ])("detects a commitment: %s", (text) => {
    expect(containsCommitmentLanguage(text)).toBe(true);
  });

  it("blocks an unregistered promise", () => {
    expect(
      validateOutboundMessage({
        text: "Kontrol edip döneceğim.",
        openCommitmentIds: [],
        hasPendingHandoff: false,
      }),
    ).toEqual({
      ok: false,
      reason: "Bu mesaj geleceğe dönük söz içeriyor; önce açık iş oluşturulmalı ve commitment_id verilmelidir.",
    });
  });

  it("allows a promise linked to an open commitment", () => {
    expect(
      validateOutboundMessage({
        text: "Kontrol edip döneceğim.",
        commitmentId: "commitment-1",
        openCommitmentIds: ["commitment-1"],
        hasPendingHandoff: false,
      }),
    ).toEqual({ ok: true });
  });

  it("blocks a fake human handoff", () => {
    expect(containsHandoffLanguage("Sizi yetkiliye aktarıyorum.")).toBe(true);
    expect(
      validateOutboundMessage({
        text: "Sizi yetkiliye aktarıyorum.",
        openCommitmentIds: [],
        hasPendingHandoff: false,
      }).ok,
    ).toBe(false);
  });
});

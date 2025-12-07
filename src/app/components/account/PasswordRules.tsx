"use client";

import React, { useMemo } from "react";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface PasswordRulesProps {
  password: string;
  confirmPassword?: string;
}

const PasswordRules: React.FC<PasswordRulesProps> = ({
  password,
  confirmPassword,
}) => {
  const rulesState = useMemo(() => {
    const lengthOk = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const checks = { lengthOk, hasUpper, hasLower, hasDigit, hasSpecial };
    const score = Object.values(checks).filter(Boolean).length;

    let strengthLabel = "Şifre girin";
    let strengthColor = "bg-gray-300";
    let strengthWidth = "w-1/12";

    if (score >= 4) {
      strengthLabel = "Güçlü";
      strengthColor = "bg-emerald-500";
      strengthWidth = "w-full";
    } else if (score === 3) {
      strengthLabel = "Orta";
      strengthColor = "bg-amber-500";
      strengthWidth = "w-3/5";
    } else if (score === 2) {
      strengthLabel = "Zayıf";
      strengthColor = "bg-orange-500";
      strengthWidth = "w-2/5";
    } else if (score === 1) {
      strengthLabel = "Çok Zayıf";
      strengthColor = "bg-red-500";
      strengthWidth = "w-1/5";
    }

    const unmetRules: string[] = [];
    if (!lengthOk) unmetRules.push("En az 8 karakter olmalı.");
    if (!hasUpper) unmetRules.push("En az bir BÜYÜK harf içermeli (A-Z).");
    if (!hasLower) unmetRules.push("En az bir küçük harf içermeli (a-z).");
    if (!hasDigit) unmetRules.push("En az bir rakam içermeli (0-9).");
    if (!hasSpecial)
      unmetRules.push("En az bir özel karakter (@$!%*?&) içermeli.");

    const passwordsMatch =
      confirmPassword && confirmPassword.length > 0
        ? password === confirmPassword
        : true;

    return {
      strengthLabel,
      strengthColor,
      strengthWidth,
      unmetRules,
      passwordsMatch,
      allOk:
        unmetRules.length === 0 &&
        password.length > 0 &&
        passwordsMatch,
    };
  }, [password, confirmPassword]);

  // Hiç şifre girilmediyse component’i göstermiyoruz
  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      {/* Güç çubuğu */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500">Şifre Gücü</span>
          <span
            className={
              rulesState.allOk
                ? "text-emerald-600 font-medium"
                : "text-gray-600"
            }
          >
            {rulesState.strengthLabel}
          </span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${rulesState.strengthColor} ${rulesState.strengthWidth} transition-all duration-300`}
          />
        </div>
      </div>

      {/* Eksik kurallar */}
      {rulesState.unmetRules.length > 0 ? (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <FiAlertCircle className="w-3 h-3 text-red-500" />
            <span>Bu kuralları sağlamanız gerekir:</span>
          </div>
          <ul className="pl-4 space-y-1 list-disc text-[11px] text-gray-600">
            {rulesState.unmetRules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
          <FiCheckCircle className="w-3 h-3" />
          <span>Şifreniz tüm kurallara uyuyor.</span>
        </div>
      )}

      {/* Şifre eşleşme kontrolü */}
      {confirmPassword && confirmPassword.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px]">
          {rulesState.passwordsMatch ? (
            <>
              <FiCheckCircle className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600">
                Yeni şifre ve tekrar şifresi eşleşiyor.
              </span>
            </>
          ) : (
            <>
              <FiXCircle className="w-3 h-3 text-red-500" />
              <span className="text-red-500">
                Yeni şifre ile tekrar şifre uyuşmuyor.
              </span>
            </>
          )}
        </div>
      )}

      {/* Örnek güçlü şifre */}
      <div className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
        <span className="font-medium text-gray-700">Örnek güçlü şifre:</span>{" "}
        <code className="text-gray-900">Abc!1234</code>
      </div>
    </div>
  );
};

export default PasswordRules;

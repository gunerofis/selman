import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Route$14, dt as adminLogin, ft as adminLogout, gt as updateAdminProduct, ht as getAdminCatalog } from "./router-BRoH_qS_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as EyeOff, T as Eye, V as Archive, f as Settings2, h as RefreshCw, m as Save, p as Search, y as LogOut } from "../_libs/lucide-react.mjs";
import { C as Input, E as formatPrice, T as cn, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/urun-temizlik-9koPJCrR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 18;
function CleanupPage() {
	const { session, items } = Route$14.useLoaderData();
	const router = useRouter();
	const [password, setPassword] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [needsOtp, setNeedsOtp] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function login(event) {
		event.preventDefault();
		setBusy(true);
		try {
			const result = await adminLogin({ data: {
				username: username || void 0,
				password,
				otp: otp || void 0
			} });
			if (!result.ok) {
				if ("twoFactorRequired" in result && result.twoFactorRequired) setNeedsOtp(true);
				return toast.error(result.error);
			}
			setPassword("");
			await router.invalidate();
		} catch {
			toast.error("Giriş yapılamadı.");
		} finally {
			setBusy(false);
		}
	}
	if (!session.authenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-[calc(100vh-7rem)] place-items-center bg-bg-wash px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md border border-border bg-bg-elevated p-7 shadow-[0_24px_80px_rgba(15,35,25,.08)] sm:p-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-11 items-center justify-center rounded-full bg-accent text-fg-on-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-7 font-mono text-xs tracking-[.16em] text-fg-muted uppercase",
					children: "Sweb"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Ürün temizlik"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-fg-muted",
					children: "Büyük görsellerle ürünleri hızlıca gözden geçirin, pasife alın veya arşivleyin."
				}),
				session.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: login,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Kullanıcı adı"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "Sahip girişi için boş bırakın",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Yönetim parolası"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								autoComplete: "current-password",
								required: true
							})]
						}),
						needsOtp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Doğrulama kodu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: otp,
								onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Kontrol ediliyor…" : "Giriş yap"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-7 border border-danger/30 bg-danger/5 p-4 text-sm text-danger",
					children: "Yönetim erişimi yapılandırılmadı."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cleanup, { initialItems: items });
}
function Cleanup({ initialItems }) {
	const router = useRouter();
	const [items, setItems] = (0, import_react.useState)(initialItems);
	const [query, setQuery] = (0, import_react.useState)("");
	const [line, setLine] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("active");
	const [page, setPage] = (0, import_react.useState)(1);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const lines = (0, import_react.useMemo)(() => [...new Map(items.map((x) => [x.lineKey, x.lineTitle])).entries()], [items]);
	const counts = (0, import_react.useMemo)(() => ({
		active: items.filter((x) => x.status === "active").length,
		inactive: items.filter((x) => x.status === "inactive").length,
		archived: items.filter((x) => x.status === "archived").length
	}), [items]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLocaleLowerCase("tr-TR");
		return items.filter((x) => (line === "all" || x.lineKey === line) && (status === "all" || x.status === status) && (!q || `${x.name} ${x.id} ${x.lineTitle}`.toLocaleLowerCase("tr-TR").includes(q)));
	}, [
		items,
		line,
		query,
		status
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safe = Math.min(page, pages);
	const shown = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);
	function update(next) {
		setItems((old) => old.map((x) => x.productKey === next.productKey ? next : x));
	}
	async function refresh() {
		setRefreshing(true);
		try {
			setItems(await getAdminCatalog());
			toast.success("Ürünler yenilendi.");
		} catch {
			toast.error("Yenilenemedi.");
		} finally {
			setRefreshing(false);
		}
	}
	async function logout() {
		await adminLogout();
		await router.invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-[calc(100vh-7rem)] bg-bg-wash",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-bg-elevated px-4 py-6 sm:px-7 lg:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-[1400px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-[.14em] text-fg-muted uppercase",
								children: "Sweb / Geçici temizlik ekranı"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-display text-3xl sm:text-4xl",
								children: "Ürün temizlik"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-fg-muted",
								children: "Büyük görsellerle ürünleri seçin; isim ve fiyatı düzenleyin, pasife alın veya arşivleyin."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/yonetim",
									className: "inline-flex h-11 items-center justify-center gap-2 border border-border-strong px-3 text-xs font-medium text-fg transition-colors hover:border-fg",
									children: "Yönetim merkezi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: refreshing,
									onClick: () => void refresh(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", refreshing && "animate-spin") }), "Yenile"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-fg-muted",
									onClick: () => void logout(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Çıkış"]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tally, {
								label: "Yayında",
								value: counts.active,
								tone: "active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tally, {
								label: "Pasif",
								value: counts.inactive,
								tone: "inactive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tally, {
								label: "Arşivde",
								value: counts.archived,
								tone: "archived"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-20 border-b border-border bg-bg-elevated/95 px-4 py-3 backdrop-blur sm:px-7 lg:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-[minmax(16rem,1fr)_14rem_12rem]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Ara"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "pl-10",
									placeholder: "Ürün adı, kod veya kategori",
									value: query,
									onChange: (e) => {
										setQuery(e.target.value);
										setPage(1);
									}
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Kategori"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: line,
							onChange: (e) => {
								setLine(e.target.value);
								setPage(1);
							},
							className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Tüm kategoriler"
							}), lines.map(([k, t]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: t
							}, k))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Durum"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: status,
							onChange: (e) => {
								setStatus(e.target.value);
								setPage(1);
							},
							className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "Tüm durumlar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "active",
									children: "Yayında"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "inactive",
									children: "Pasif"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: "Arşivde"
								})
							]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-7 lg:px-10",
				children: [shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-16 text-center text-sm text-fg-muted",
					children: "Bu filtrelerle eşleşen ürün yok."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
					children: shown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						item,
						onChange: update
					}, item.productKey))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-between border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-fg-muted",
						children: [
							filtered.length,
							" ürün · Sayfa ",
							safe,
							"/",
							pages
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: safe <= 1,
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							children: "Önceki"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: safe >= pages,
							onClick: () => setPage((p) => Math.min(pages, p + 1)),
							children: "Sonraki"
						})]
					})]
				})]
			})
		]
	});
}
function Card({ item, onChange }) {
	const [name, setName] = (0, import_react.useState)(item.name);
	const [price, setPrice] = (0, import_react.useState)(item.price == null ? "" : String(item.price));
	const [saving, setSaving] = (0, import_react.useState)(false);
	const dirty = name.trim() !== item.name || price.trim() !== (item.price == null ? "" : String(item.price));
	async function persist(nextStatus) {
		const trimmed = name.trim();
		if (trimmed.length < 2) return toast.error("Ürün adı en az 2 karakter olmalı.");
		const p = price.trim() === "" ? null : Number(price.replace(",", "."));
		if (p != null && (!Number.isFinite(p) || p < 0)) return toast.error("Geçerli bir fiyat girin.");
		const status = nextStatus ?? item.status;
		setSaving(true);
		try {
			await updateAdminProduct({ data: {
				productKey: item.productKey,
				name: trimmed,
				price: p,
				status,
				seoTitle: item.seoTitle,
				seoDescription: item.seoDescription,
				imageAlt: item.imageAlt
			} });
			onChange({
				...item,
				name: trimmed,
				price: p,
				status,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast.success(nextStatus === "inactive" ? "Pasife alındı." : nextStatus === "archived" ? "Arşivlendi." : nextStatus === "active" ? "Yayınlandı." : "Kaydedildi.");
		} catch {
			toast.error("İşlem tamamlanamadı.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex flex-col border border-border bg-bg-elevated transition-opacity", item.status !== "active" && "opacity-70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square bg-bg-wash",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.image,
				alt: item.imageAlt,
				className: "size-full object-contain p-4",
				loading: "lazy",
				width: 1500,
				height: 1500
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-3 left-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate font-mono text-xs text-fg-muted",
					children: [
						item.lineTitle,
						" · ",
						item.id
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs font-medium text-fg-muted",
						children: "Ürün adı"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						maxLength: 120
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-fg-muted",
							children: "Fiyat (TL)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: price,
							placeholder: "Teklif ile",
							onChange: (e) => setPrice(e.target.value)
						}),
						price.trim() !== "" && Number.isFinite(Number(price.replace(",", "."))) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-fg-subtle",
							children: formatPrice(Number(price.replace(",", ".")))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto space-y-2 pt-1",
					children: [dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "w-full",
						disabled: saving,
						onClick: () => void persist(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), saving ? "Kaydediliyor…" : "İsim / fiyatı kaydet"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: saving || item.status === "active",
								onClick: () => void persist("active"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "Yayında"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: saving || item.status === "inactive",
								onClick: () => void persist("inactive"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }), "Pasif"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "text-danger",
								disabled: saving || item.status === "archived",
								onClick: () => void persist("archived"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }), "Arşiv"]
							})
						]
					})]
				})
			]
		})]
	});
}
function Tally({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1", tone === "active" ? "border-accent/30 bg-accent/10 text-accent" : tone === "inactive" ? "border-border bg-bg-wash text-fg-muted" : "border-danger/30 bg-danger/10 text-danger"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-current" }),
			label,
			": ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "font-semibold",
				children: value
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs shadow-sm", status === "active" ? "bg-accent text-fg-on-deep" : status === "inactive" ? "bg-bg-elevated text-fg-muted" : "bg-danger text-fg-on-deep"),
		children: status === "active" ? "Yayında" : status === "inactive" ? "Pasif" : "Arşivde"
	});
}
//#endregion
export { CleanupPage as component };

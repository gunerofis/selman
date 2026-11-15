import { i as __toESM } from "../_runtime.mjs";
import { d as payLabel } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { dt as adminLogin, ft as adminLogout, g as Route$13, gt as updateAdminProduct, ht as getAdminCatalog, mt as getAdminAudit, ot as getAdminOrders, pt as bulkUpdateAdminProducts, st as reviewOrder } from "./router-BRoH_qS_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as EyeOff, H as Activity, I as Check, N as ChevronRight, P as ChevronLeft, R as Boxes, T as Eye, V as Archive, b as LayoutDashboard, c as ShoppingBag, f as Settings2, h as RefreshCw, j as ClipboardList, m as Save, p as Search, t as X, y as LogOut } from "../_libs/lucide-react.mjs";
import { C as Input, E as formatPrice, T as cn, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/yonetim-CiVecrkF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 24;
var sections = {
	overview: {
		label: "Genel bakış",
		description: "Mağazanın güncel durumu",
		icon: LayoutDashboard
	},
	orders: {
		label: "Sipariş talepleri",
		description: "Gelen talepleri inceleyin",
		icon: ShoppingBag
	},
	products: {
		label: "Ürünler",
		description: "Katalog ve yayın durumları",
		icon: Boxes
	},
	activity: {
		label: "Hareketler",
		description: "Son yönetim değişiklikleri",
		icon: Activity
	}
};
function AdminPage() {
	const { session, items, orders, audit } = Route$13.useLoaderData();
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
					children: "Yönetim merkezi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-fg-muted",
					children: "Ürünleri, fiyatları ve sipariş taleplerini güvenli biçimde yönetin."
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {
		initialItems: items,
		initialOrders: orders,
		initialAudit: audit,
		permissions: session.user.permissions,
		isOwner: session.user.isOwner
	});
}
function Workspace({ initialItems, initialOrders, initialAudit, permissions, isOwner }) {
	const router = useRouter();
	const [section, setSection] = (0, import_react.useState)("overview");
	const [items, setItems] = (0, import_react.useState)(initialItems);
	const [orders, setOrders] = (0, import_react.useState)(initialOrders);
	const [audit, setAudit] = (0, import_react.useState)(initialAudit);
	const allowed = (key) => isOwner || permissions.includes(key);
	const visibleSections = Object.keys(sections).filter((key) => key === "overview" || key === "products" && allowed("products.view") || key === "orders" && allowed("orders.view") || key === "activity" && allowed("logs.view"));
	async function refreshAll() {
		try {
			const [a, b, c] = await Promise.all([
				allowed("products.view") ? getAdminCatalog() : Promise.resolve([]),
				allowed("orders.view") ? getAdminOrders() : Promise.resolve([]),
				allowed("logs.view") ? getAdminAudit() : Promise.resolve([])
			]);
			setItems(a);
			setOrders(b);
			setAudit(c);
			toast.success("Yönetim verileri yenilendi.");
		} catch {
			toast.error("Veriler yenilenemedi.");
		}
	}
	async function logout() {
		await adminLogout();
		await router.invalidate();
	}
	const meta = sections[section];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-[calc(100vh-7rem)] bg-bg-wash lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden border-r border-border bg-bg-elevated lg:flex lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Sweb"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: "Yönetim merkezi"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Yönetim bölümleri",
					className: "mt-5 space-y-1",
					children: visibleSections.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
						name: key,
						active: section === key,
						onClick: () => setSection(key)
					}, key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto space-y-2 border-t border-border pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full justify-start",
						onClick: () => void refreshAll(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Verileri yenile"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "w-full justify-start text-fg-muted",
						onClick: () => void logout(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Çıkış yap"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-0 z-20 border-b border-border bg-bg-elevated/95 px-4 py-3 backdrop-blur lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						"aria-label": "Yönetim bölümü",
						value: section,
						onChange: (e) => setSection(e.target.value),
						className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm font-medium",
						children: visibleSections.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: key,
							children: sections[key].label
						}, key))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "border-b border-border bg-bg-elevated px-4 py-6 sm:px-7 lg:px-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-[1400px] items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs tracking-[.14em] text-fg-muted uppercase",
								children: ["Yönetim / ", meta.label]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-display text-3xl sm:text-4xl",
								children: meta.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-fg-muted",
								children: meta.description
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "hidden sm:flex lg:hidden",
							onClick: () => void logout(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Çıkış"]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-7 lg:px-10 lg:py-9",
					children: [
						section === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
							items,
							orders,
							audit,
							go: setSection
						}),
						section === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Products, {
							items,
							setItems,
							refreshAudit: async () => setAudit(await getAdminAudit())
						}),
						section === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {
							orders,
							setOrders
						}),
						section === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, {
							entries: audit,
							items
						})
					]
				})
			]
		})]
	});
}
function Nav({ name, active, onClick }) {
	const Icon = sections[name].icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": active ? "page" : void 0,
		className: cn("flex h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-sm transition-colors", active ? "bg-accent text-fg-on-deep" : "text-fg-muted hover:bg-bg-wash hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), sections[name].label]
	});
}
function Overview({ items, orders, audit, go }) {
	const active = items.filter((x) => x.status === "active").length, inactive = items.filter((x) => x.status === "inactive").length, archived = items.filter((x) => x.status === "archived").length, fresh = orders.filter((x) => x.status === "new").length;
	const cards = [
		{
			label: "Yayındaki ürün",
			value: active,
			note: `${items.length} toplam kayıt`,
			icon: Boxes,
			target: "products"
		},
		{
			label: "Bekleyen talep",
			value: fresh,
			note: `${orders.length} son sipariş talebi`,
			icon: ClipboardList,
			target: "orders"
		},
		{
			label: "Pasif ürün",
			value: inactive,
			note: "Mağazada görünmez",
			icon: EyeOff,
			target: "products"
		},
		{
			label: "Arşivlenen",
			value: archived,
			note: "Geri alınabilir",
			icon: Archive,
			target: "products"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
		children: cards.map(({ label, value, note, icon: Icon, target }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => go(target),
			className: "border border-border bg-bg-elevated p-5 text-left hover:border-border-strong",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-accent" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-4xl",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-fg-subtle",
					children: note
				})
			]
		}, label))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Yeni sipariş talepleri",
			action: "Tümünü gör",
			onAction: () => go("orders"),
			children: [orders.filter((x) => x.status === "new").slice(0, 5).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => go("orders"),
				className: "flex w-full items-center justify-between gap-3 border-t border-border px-5 py-4 text-left hover:bg-bg-wash",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: o.customer.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: [
							date(o.at),
							" · ",
							o.items.length,
							" kalem"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "shrink-0 text-sm font-medium",
					children: formatPrice(o.total)
				})]
			}, o.id)), fresh === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Bekleyen yeni sipariş talebi yok." })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Son hareketler",
			action: "Tümü",
			onAction: () => go("activity"),
			children: [audit.slice(0, 5).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: actionLabel(e.action)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 truncate font-mono text-xs text-fg-muted",
					children: [
						e.productKey,
						" · ",
						date(e.createdAt)
					]
				})]
			}, e.id)), audit.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Henüz yönetim hareketi yok." })]
		})]
	})] });
}
function Panel({ title, action, onAction, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onAction,
				children: [action, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
			})]
		}), children]
	});
}
function Products({ items, setItems, refreshAudit }) {
	const [query, setQuery] = (0, import_react.useState)(""), [line, setLine] = (0, import_react.useState)("all"), [status, setStatus] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1), [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set()), [editing, setEditing] = (0, import_react.useState)(null), [busy, setBusy] = (0, import_react.useState)(false);
	const lines = (0, import_react.useMemo)(() => [...new Map(items.map((x) => [x.lineKey, x.lineTitle])).entries()], [items]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLocaleLowerCase("tr-TR");
		return items.filter((x) => (line === "all" || x.lineKey === line) && (status === "all" || x.status === status) && (!q || `${x.name} ${x.id} ${x.lineTitle}`.toLocaleLowerCase("tr-TR").includes(q)));
	}, [
		items,
		line,
		query,
		status
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), safe = Math.min(page, pages), shown = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE), all = shown.length > 0 && shown.every((x) => selected.has(x.productKey));
	function toggle(key) {
		setSelected((old) => {
			const n = new Set(old);
			if (n.has(key)) n.delete(key);
			else n.add(key);
			return n;
		});
	}
	async function bulk(next) {
		if (!selected.size) return;
		setBusy(true);
		try {
			await bulkUpdateAdminProducts({ data: {
				productKeys: [...selected],
				status: next
			} });
			const count = selected.size;
			setItems(items.map((x) => selected.has(x.productKey) ? {
				...x,
				status: next,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : x));
			setSelected(/* @__PURE__ */ new Set());
			await refreshAudit();
			toast.success(`${count} ürün güncellendi.`);
		} catch {
			toast.error("Toplu işlem tamamlanamadı.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-border bg-bg-elevated",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 border-b border-border p-4 lg:grid-cols-[minmax(16rem,1fr)_13rem_11rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: (v) => {
							setQuery(v);
							setPage(1);
						},
						placeholder: "Ürün adı, kod veya kategori"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Kategori",
						value: line,
						onChange: (v) => {
							setLine(v);
							setPage(1);
						},
						options: [["all", "Tüm kategoriler"], ...lines]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Durum",
						value: status,
						onChange: (v) => {
							setStatus(v);
							setPage(1);
						},
						options: [
							["all", "Tüm durumlar"],
							["active", "Yayında"],
							["inactive", "Pasif"],
							["archived", "Arşivde"]
						]
					})
				]
			}),
			selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "status",
				className: "flex flex-wrap items-center gap-2 border-b border-border bg-accent/5 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "w-full text-sm font-medium sm:mr-auto sm:w-auto",
						children: [selected.size, " ürün seçildi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: busy,
						onClick: () => void bulk("active"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "Yayınla"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: busy,
						onClick: () => void bulk("inactive"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }), "Pasife al"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "text-danger",
						disabled: busy,
						onClick: () => void bulk("archived"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }), "Arşivle"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setSelected(/* @__PURE__ */ new Set()),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only sm:not-sr-only",
							children: "Temizle"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full table-fixed border-collapse text-left text-sm md:table-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-bg-wash text-xs text-fg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-11 px-3 py-3 sm:w-12 sm:px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								"aria-label": "Bu sayfadaki ürünleri seç",
								checked: all,
								onChange: () => setSelected((old) => {
									const n = new Set(old);
									shown.forEach((x) => all ? n.delete(x.productKey) : n.add(x.productKey));
									return n;
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 font-medium",
							children: "Ürün"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium md:table-cell",
							children: "Kategori"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium md:table-cell",
							children: "Fiyat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium md:table-cell",
							children: "Durum"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-12 px-2 py-3 text-right font-medium sm:w-28",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only sm:not-sr-only",
								children: "İşlem"
							})
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: shown.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-bg-wash/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 sm:px-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									"aria-label": `${x.name} seç`,
									checked: selected.has(x.productKey),
									onChange: () => toggle(x.productKey)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "min-w-0 px-2 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-11 shrink-0 bg-bg-wash sm:size-12",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: x.image,
											alt: "",
											className: "size-full object-contain p-1",
											loading: "lazy",
											width: 1500,
											height: 1500
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium",
											children: x.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 truncate font-mono text-xs text-fg-muted sm:text-xs",
											children: x.id
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "hidden px-4 py-3 text-fg-muted md:table-cell",
								children: x.lineTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "hidden px-4 py-3 md:table-cell",
								children: x.price == null ? "Teklif" : formatPrice(x.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "hidden px-4 py-3 md:table-cell",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { status: x.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									"aria-label": `${x.name} düzenle`,
									onClick: () => setEditing(x),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Düzenle"
									})]
								})
							})
						]
					}, x.productKey))
				})]
			}),
			shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Bu filtrelerle eşleşen ürün yok." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border px-4 py-3",
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
						"aria-label": "Önceki sayfa",
						disabled: safe <= 1,
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						"aria-label": "Sonraki sayfa",
						disabled: safe >= pages,
						onClick: () => setPage((p) => Math.min(pages, p + 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})]
				})]
			})
		]
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		item: editing,
		onClose: () => setEditing(null),
		onSaved: async (next) => {
			setItems(items.map((x) => x.productKey === next.productKey ? next : x));
			setEditing(next);
			await refreshAudit();
		}
	})] });
}
function Editor({ item, onClose, onSaved }) {
	const [name, setName] = (0, import_react.useState)(item.name), [price, setPrice] = (0, import_react.useState)(item.price == null ? "" : String(item.price)), [status, setStatus] = (0, import_react.useState)(item.status), [saving, setSaving] = (0, import_react.useState)(false);
	const changed = name.trim() !== item.name || price.trim() !== (item.price == null ? "" : String(item.price)) || status !== item.status;
	async function save(e) {
		e.preventDefault();
		const p = price.trim() === "" ? null : Number(price.replace(",", "."));
		if (p != null && (!Number.isFinite(p) || p < 0)) return toast.error("Geçerli bir fiyat girin.");
		setSaving(true);
		try {
			await updateAdminProduct({ data: {
				productKey: item.productKey,
				name: name.trim(),
				price: p,
				status,
				seoTitle: item.seoTitle,
				seoDescription: item.seoDescription,
				imageAlt: item.imageAlt
			} });
			await onSaved({
				...item,
				name: name.trim(),
				price: p,
				status,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast.success("Ürün kaydedildi.");
		} catch {
			toast.error("Değişiklik kaydedilemedi.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-black/25",
		onMouseDown: (e) => {
			if (e.currentTarget === e.target) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "edit-title",
			className: "h-full w-full max-w-lg overflow-y-auto bg-bg-elevated shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-elevated px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-fg-muted",
					children: [
						item.lineKey.toUpperCase(),
						" · ",
						item.id
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "edit-title",
					className: "mt-1 font-display text-2xl",
					children: "Ürünü düzenle"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					"aria-label": "Kapat",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto aspect-square max-w-[18rem] bg-bg-wash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image,
							alt: "",
							className: "size-full object-contain p-4",
							width: 1500,
							height: 1500
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Ürün adı"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									minLength: 2,
									maxLength: 120,
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Fiyat (TL)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: price,
									placeholder: "Teklif ile",
									onChange: (e) => setPrice(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Yayın durumu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: status,
									onChange: (e) => setStatus(e.target.value),
									className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm",
									children: [
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
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-bg-wash p-4 text-xs leading-5 text-fg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Kaynak adı: ", item.baseName] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Kaynak fiyat:",
										" ",
										item.basePrice == null ? "Tanımlı değil" : formatPrice(item.basePrice)
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Son değişiklik: ", item.updatedAt ? date(item.updatedAt) : "Henüz değiştirilmedi"] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex justify-end gap-2 border-t border-border pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: onClose,
							children: "Vazgeç"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: !changed || saving,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), saving ? "Kaydediliyor…" : "Kaydet"]
						})]
					})
				]
			})]
		})
	});
}
function Orders({ orders, setOrders }) {
	const [query, setQuery] = (0, import_react.useState)(""), [status, setStatus] = (0, import_react.useState)("all"), [busy, setBusy] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLocaleLowerCase("tr-TR");
		return orders.filter((o) => (status === "all" || o.status === status) && (!q || `${o.id} ${o.customer.name} ${o.customer.email} ${o.customer.phone}`.toLocaleLowerCase("tr-TR").includes(q)));
	}, [
		orders,
		query,
		status
	]);
	async function reviewed(id) {
		setBusy(id);
		try {
			await reviewOrder({ data: { id } });
			setOrders(orders.map((o) => o.id === id ? {
				...o,
				status: "reviewed"
			} : o));
			toast.success("Sipariş talebi incelendi olarak işaretlendi.");
		} catch {
			toast.error("Sipariş durumu kaydedilemedi.");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_12rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
				value: query,
				onChange: setQuery,
				placeholder: "Ad, telefon, e-posta veya talep no"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
				label: "Sipariş durumu",
				value: status,
				onChange: (v) => setStatus(v),
				options: [
					["all", "Tüm talepler"],
					["new", "Yeni"],
					["reviewed", "İncelendi"]
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "flex cursor-pointer list-none items-center gap-3 px-4 py-4 hover:bg-bg-wash sm:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", o.status === "new" ? "bg-accent" : "bg-fg-subtle") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: o.customer.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 truncate text-xs text-fg-muted",
								children: [
									o.id,
									" · ",
									date(o.at)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hidden text-sm text-fg-muted sm:block",
							children: [o.items.length, " kalem"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 text-sm font-medium",
							children: formatPrice(o.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-fg-muted transition-transform group-open:rotate-90" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border bg-bg-wash px-4 py-5 sm:px-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 text-sm lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium",
							children: "Müşteri ve teslimat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1 text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: o.customer.email }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: o.customer.phone }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: o.customer.address }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									o.customer.district,
									" / ",
									o.customer.city,
									" · ",
									o.customer.postal
								] }),
								o.customer.taxNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Vergi / TC no: ", o.customer.taxNumber] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: payLabel(o.customer.pay) }),
								o.customer.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-fg",
									children: ["Not: ", o.customer.note]
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: "Ürünler"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2 text-fg-muted",
								children: o.items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										x.name,
										" · ",
										x.colorName,
										" × ",
										x.qty
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0",
										children: x.pricePending ? "Fiyat teyidi" : formatPrice(x.unitPrice * x.qty / 100)
									})]
								}, `${x.sku}:${x.color}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex justify-between border-t border-border pt-3 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Toplam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(o.total) })]
							})
						] })]
					}), o.status === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-5",
						disabled: busy === o.id,
						onClick: () => void reviewed(o.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), busy === o.id ? "Kaydediliyor…" : "İncelendi olarak işaretle"]
					})]
				})]
			}, o.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Bu filtrelerle eşleşen sipariş talebi yok." })]
		})]
	});
}
function ActivityLog({ entries, items }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const map = (0, import_react.useMemo)(() => new Map(items.map((x) => [x.productKey, x])), [items]), q = query.trim().toLocaleLowerCase("tr-TR"), filtered = entries.filter((e) => !q || `${e.productKey} ${map.get(e.productKey)?.name ?? ""} ${actionLabel(e.action)}`.toLocaleLowerCase("tr-TR").includes(q));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
				value: query,
				onChange: setQuery,
				placeholder: "Ürün veya işlem ara"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid gap-2 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: map.get(e.productKey)?.name ?? e.productKey
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-bg-wash px-2 py-1 text-xs text-fg-muted",
						children: actionLabel(e.action)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xs text-fg-muted",
					children: e.productKey
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-fg-muted sm:text-right",
					children: [
						date(e.createdAt),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Yönetici"
					]
				})]
			}, e.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Eşleşen yönetim hareketi yok." })]
		})]
	});
}
function SearchInput({ value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Ara"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "pl-10",
				placeholder,
				value,
				onChange: (e) => onChange(e.target.value)
			})
		]
	});
}
function Select({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "sr-only",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm",
		children: options.map(([k, t]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: k,
			children: t
		}, k))
	})] });
}
function Badge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs", status === "active" ? "bg-accent/10 text-accent" : status === "inactive" ? "bg-bg-wash text-fg-muted" : "bg-danger/10 text-danger"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-current" }), status === "active" ? "Yayında" : status === "inactive" ? "Pasif" : "Arşivde"]
	});
}
function Empty({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 py-12 text-center text-sm text-fg-muted",
		children: text
	});
}
function date(value) {
	return new Date(value).toLocaleString("tr-TR", {
		timeZone: "Europe/Istanbul",
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function actionLabel(action) {
	if (action === "archive" || action.endsWith("archived")) return "Arşivlendi";
	if (action.endsWith("inactive")) return "Pasife alındı";
	if (action.endsWith("active")) return "Yayınlandı";
	return "Ürün güncellendi";
}
//#endregion
export { AdminPage as component };

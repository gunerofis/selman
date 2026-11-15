import { i as __toESM } from "../_runtime.mjs";
import { a as PERMISSION_SCOPES, i as PERMISSION_MODULES, n as APPROVAL_MODES, s as permissionLabel } from "./admin-permissions-CglL3D63.mjs";
import { a as SHIPPING_STATUSES, n as ORDER_STATUSES, r as PAYMENT_STATUSES } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as saveAdminSiteConfig } from "./site-config-BWq3LIpj.mjs";
import { B as getAdminScripts, E as Route$55, F as deleteAdminRole, G as saveAdminRecord, H as reviewAdminApproval, I as deleteAdminScript, J as saveAdminUser, K as saveAdminRole, L as deleteAdminUser, P as deleteAdminRecord, U as revokeAdminSession, dt as adminLogin, ft as adminLogout, gt as updateAdminProduct, lt as updateAdminOrder, mt as getAdminAudit, q as saveAdminScript, ut as SITE_ORIGIN, z as getAdminAccessData } from "./router-BRoH_qS_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as CodeXml, D as ExternalLink, H as Activity, L as BriefcaseBusiness, M as CircleCheck, _ as Menu, a as Trash2, b as LayoutDashboard, c as ShoppingBag, d as Settings, g as Package, k as Earth, l as ShieldCheck, m as Save, n as Users, o as Store, p as Search, r as UserCog, w as FileText, x as KeyRound, y as LogOut } from "../_libs/lucide-react.mjs";
import { C as Input, E as formatPrice, T as cn, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CVwxQ4Uj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = {
	overview: {
		label: "Genel bakış",
		icon: LayoutDashboard
	},
	products: {
		label: "Ürün ve SEO",
		icon: Package
	},
	orders: {
		label: "Siparişler",
		icon: ShoppingBag
	},
	operations: {
		label: "İş akışları",
		icon: BriefcaseBusiness
	},
	analytics: {
		label: "Analiz",
		icon: Activity
	},
	content: {
		label: "Site içeriği",
		icon: Store
	},
	navigation: {
		label: "Navbar ve footer",
		icon: Menu
	},
	seo: {
		label: "Site SEO",
		icon: Earth
	},
	scripts: {
		label: "Site kodları",
		icon: CodeXml
	},
	activity: {
		label: "İşlem geçmişi",
		icon: Activity
	},
	users: {
		label: "Kullanıcılar",
		icon: Users
	},
	roles: {
		label: "Roller ve yetkiler",
		icon: UserCog
	},
	approvals: {
		label: "İşlem onayları",
		icon: CircleCheck
	},
	security: {
		label: "Güvenlik",
		icon: KeyRound
	},
	system: {
		label: "Sistem",
		icon: Settings
	}
};
function Admin() {
	const data = Route$55.useLoaderData(), router = useRouter();
	const [password, setPassword] = (0, import_react.useState)(""), [username, setUsername] = (0, import_react.useState)(""), [otp, setOtp] = (0, import_react.useState)(""), [needsOtp, setNeedsOtp] = (0, import_react.useState)(false), [setupSecret, setSetupSecret] = (0, import_react.useState)(null), [busy, setBusy] = (0, import_react.useState)(false);
	async function login(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const r = await adminLogin({ data: {
				username: username || void 0,
				password,
				otp: otp || void 0
			} });
			if (!r.ok) {
				if ("twoFactorRequired" in r && r.twoFactorRequired) {
					setNeedsOtp(true);
					setSetupSecret(r.setupSecret ?? null);
				}
				return toast.error(r.error);
			}
			await router.invalidate();
		} catch {
			toast.error("Giriş yapılamadı.");
		} finally {
			setBusy(false);
		}
	}
	if (!data.session.authenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg-wash p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md border border-border bg-bg-elevated p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-10 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-mono text-xs tracking-widest text-fg-muted uppercase",
					children: "Sweb · Teknik erişim"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-fg-muted",
					children: "SEO, ürün verisi ve site kodları için tam yetkili alan."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: login,
					className: "mt-7 space-y-4",
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
						needsOtp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "6 haneli doğrulama kodu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: otp,
								onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)),
								required: true
							})]
						}), setupSecret && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-bg-wash p-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Authenticator uygulamasına bu anahtarı ekleyin:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "mt-2 block break-all font-mono",
								children: setupSecret
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Admin parolası"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
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
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Console, {
		initialItems: data.items,
		initialOrders: data.orders,
		initialOperations: data.operations,
		initialScripts: data.scripts,
		initialAudit: data.audit,
		initialSiteConfig: data.siteConfig,
		initialAccess: data.access,
		identity: data.session.user
	});
}
function Console({ initialItems, initialOrders, initialOperations, initialScripts, initialAudit, initialSiteConfig, initialAccess, identity }) {
	const router = useRouter();
	const [area, setArea] = (0, import_react.useState)("overview"), [items, setItems] = (0, import_react.useState)(initialItems), [orders, setOrders] = (0, import_react.useState)(initialOrders), [operations, setOperations] = (0, import_react.useState)(initialOperations), [scripts, setScripts] = (0, import_react.useState)(initialScripts), [audit, setAudit] = (0, import_react.useState)(initialAudit), [siteConfig, setSiteConfig] = (0, import_react.useState)(initialSiteConfig);
	const [access, setAccess] = (0, import_react.useState)(initialAccess);
	const allowed = (key) => identity.isOwner || identity.permissions.includes(key);
	const visibleAreas = Object.keys(nav).filter((key) => {
		const permissions = {
			products: ["products.view"],
			orders: ["orders.view"],
			operations: OPERATION_MODULES.flatMap((module) => operationViewPermissions(module)),
			analytics: [
				"analytics.view",
				"analytics.sales",
				"analytics.customers",
				"analytics.quotes"
			],
			content: ["settings.view", "content.view"],
			navigation: [
				"settings.view",
				"content.manage_menu",
				"theme.edit_menu",
				"theme.edit_footer"
			],
			seo: [
				"settings.view",
				"seo.edit",
				"seo.edit_title"
			],
			scripts: ["theme.edit_code"],
			activity: ["logs.view"],
			users: ["users.view"],
			roles: ["roles.view"],
			approvals: ["approvals.view"],
			security: ["security.view_sessions", "security.view_logins"]
		};
		return !permissions[key] || permissions[key].some(allowed);
	});
	async function refreshAccess() {
		setAccess(await getAdminAccessData());
	}
	async function logout() {
		await adminLogout();
		await router.invalidate();
	}
	async function refreshAudit() {
		setAudit(await getAdminAudit());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-[#eef2ed] lg:grid lg:grid-cols-[16rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "border-b border-[#d5ddd6] bg-[#102f25] p-4 text-white lg:min-h-dvh lg:border-r lg:border-b-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Sweb Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-white/60",
						children: "Teknik yönetim"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "text-white hover:bg-white/10 lg:hidden",
						onClick: () => void logout(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-5 grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1",
					children: visibleAreas.map((key) => {
						const Icon = nav[key].icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setArea(key),
							className: cn("flex min-h-11 items-center gap-2 rounded px-3 text-left text-sm", area === key ? "bg-white text-[#102f25]" : "text-white/70 hover:bg-white/10 hover:text-white"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), nav[key].label]
						}, key);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 hidden border-t border-white/15 pt-4 lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/yonetim",
						className: "flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white",
						children: ["Sade yönetim", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void logout(),
						className: "mt-1 flex w-full items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Çıkış"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0 p-4 sm:p-7 lg:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tracking-widest text-fg-muted uppercase",
						children: ["Admin / ", nav[area].label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl",
						children: nav[area].label
					})]
				}),
				area === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
					items,
					orders,
					operations,
					scripts,
					siteConfig
				}),
				area === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSeo, {
					items,
					setItems,
					refreshAudit
				}),
				" ",
				area === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {
					orders,
					setOrders,
					refreshAudit
				}),
				" ",
				area === "operations" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperationsAdmin, {
					records: operations,
					setRecords: setOperations,
					access,
					identity,
					refreshAudit
				}),
				" ",
				area === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsAdmin, {
					records: operations,
					orders
				}),
				" ",
				area === "content" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteConfigEditor, {
					mode: "content",
					value: siteConfig,
					onSaved: setSiteConfig,
					refreshAudit
				}),
				" ",
				area === "navigation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationEditor, {
					value: siteConfig,
					onSaved: setSiteConfig,
					refreshAudit
				}),
				" ",
				area === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteConfigEditor, {
					mode: "seo",
					value: siteConfig,
					onSaved: setSiteConfig,
					refreshAudit
				}),
				" ",
				area === "scripts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts$1, {
					scripts,
					setScripts,
					refreshAudit
				}),
				" ",
				area === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Audit, { entries: audit }),
				" ",
				area === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersAdmin, {
					access,
					refresh: refreshAccess
				}),
				" ",
				area === "roles" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RolesAdmin, {
					access,
					refresh: refreshAccess
				}),
				" ",
				area === "approvals" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalsAdmin, {
					access,
					refresh: refreshAccess
				}),
				" ",
				area === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityAdmin, {
					access,
					currentSessionId: identity.sessionId,
					refresh: refreshAccess
				}),
				" ",
				area === "system" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(System, {
					items,
					orders,
					scripts,
					config: siteConfig
				})
			]
		})]
	});
}
function Overview({ items, orders, operations, scripts, siteConfig }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Ürünler",
					value: `${items.length}`,
					note: `${items.filter((x) => x.status === "active").length} yayında`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Açık sipariş",
					value: `${orders.filter((x) => ![
						"completed",
						"cancelled",
						"archived"
					].includes(x.status)).length}`,
					note: `${orders.filter((x) => x.status === "new").length} yeni`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Açık iş akışı",
					value: `${operations.filter((x) => ![
						"completed",
						"closed",
						"cancelled",
						"archived",
						"inactive"
					].includes(x.status)).length}`,
					note: `${operations.length} yönetilen kayıt`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Menü bağlantısı",
					value: `${siteConfig.links.filter((x) => x.visible).length}`,
					note: `${siteConfig.links.length} toplam`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Site kodu",
					value: `${scripts.filter((x) => x.active).length}`,
					note: `${scripts.length} kayıt`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-border bg-bg-elevated p-5 sm:p-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Yönetim kapsamı"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-px bg-border sm:grid-cols-2",
				children: [
					"Ürün adı, fiyatı, yayın durumu ve ürün SEO bilgileri",
					"Sipariş inceleme, operasyon durumu ve yönetici notu",
					"Marka, iletişim, yasal işletme ve ana sayfa metinleri",
					"Navbar ve footer bağlantı adı, konumu ve görünürlüğü",
					"Site geneli başlık, açıklama ve sosyal paylaşım görseli",
					"İzleme ve entegrasyon kodlarının kontrollü yayını",
					"Tüm yönetim değişikliklerinin işlem geçmişi"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 bg-bg-elevated p-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-4 shrink-0 text-accent" }), item]
				}, item))
			})]
		})]
	});
}
function Orders({ orders, setOrders, refreshAudit }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(orders[0] ?? null);
	const [status, setStatus] = (0, import_react.useState)(selected?.status ?? "new");
	const [note, setNote] = (0, import_react.useState)(selected?.adminNote ?? "");
	const [paymentStatus, setPaymentStatus] = (0, import_react.useState)(selected?.paymentStatus ?? "pending");
	const [shippingStatus, setShippingStatus] = (0, import_react.useState)(selected?.shippingStatus ?? "pending");
	const [carrier, setCarrier] = (0, import_react.useState)(selected?.carrier ?? "");
	const [trackingCode, setTrackingCode] = (0, import_react.useState)(selected?.trackingCode ?? "");
	const [invoiceNumber, setInvoiceNumber] = (0, import_react.useState)(selected?.invoiceNumber ?? "");
	const [refundedAmount, setRefundedAmount] = (0, import_react.useState)(selected?.refundedAmount ?? 0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const filtered = orders.filter((order) => `${order.id} ${order.customer.name} ${order.customer.email}`.toLocaleLowerCase("tr-TR").includes(q.toLocaleLowerCase("tr-TR")));
	function choose(order) {
		setSelected(order);
		setStatus(order.status);
		setNote(order.adminNote);
		setPaymentStatus(order.paymentStatus);
		setShippingStatus(order.shippingStatus);
		setCarrier(order.carrier);
		setTrackingCode(order.trackingCode);
		setInvoiceNumber(order.invoiceNumber);
		setRefundedAmount(order.refundedAmount);
	}
	async function save(e) {
		e.preventDefault();
		if (!selected) return;
		if (status !== selected.status && ["cancelled", "archived"].includes(status) && !confirm(`${selected.id} siparişi “${orderStatusLabel(status)}” durumuna alınsın mı?`)) return;
		setBusy(true);
		try {
			await updateAdminOrder({ data: {
				id: selected.id,
				status,
				adminNote: note,
				paymentStatus,
				shippingStatus,
				carrier,
				trackingCode,
				invoiceNumber,
				refundedAmount
			} });
			const next = {
				...selected,
				status,
				adminNote: note,
				paymentStatus,
				shippingStatus,
				carrier,
				trackingCode,
				invoiceNumber,
				refundedAmount
			};
			setSelected(next);
			setOrders(orders.map((x) => x.id === next.id ? next : x));
			await refreshAudit();
			toast.success("Sipariş güncellendi.");
		} catch {
			toast.error("Sipariş güncellenemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[22rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-border bg-bg-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Sipariş, müşteri veya e-posta ara",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-fg-muted",
					children: [filtered.length, " sipariş"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
				children: filtered.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => choose(order),
					className: cn("w-full p-3 text-left", selected?.id === order.id ? "bg-accent/10" : "hover:bg-bg-wash"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: order.customer.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-fg-muted",
							children: orderStatusLabel(order.status)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-fg-muted",
						children: [
							order.id,
							" · ",
							formatPrice(order.total)
						]
					})]
				}, order.id))
			})]
		}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "border border-border bg-bg-elevated p-5 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-fg-muted",
					children: selected.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl",
					children: selected.customer.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-px bg-border sm:grid-cols-2",
					children: [
						["E-posta", selected.customer.email],
						["Telefon", selected.customer.phone],
						["Teslimat", `${selected.customer.city} / ${selected.customer.district}`],
						["Toplam", formatPrice(selected.total)]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-bg-elevated p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-fg-muted",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: v
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-2 border border-border p-4",
					children: selected.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							item.qty,
							" × ",
							item.name,
							" · ",
							item.colorName
						]
					}, `${item.sku}:${item.color}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-sm font-medium",
						children: "Sipariş durumu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
						children: ORDER_STATUSES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: x,
							children: orderStatusLabel(x)
						}, x))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Ödeme durumu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: paymentStatus,
								onChange: (e) => setPaymentStatus(e.target.value),
								className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
								children: PAYMENT_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: paymentStatusLabel(item)
								}, item))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Kargo durumu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: shippingStatus,
								onChange: (e) => setShippingStatus(e.target.value),
								className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
								children: SHIPPING_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: shippingStatusLabel(item)
								}, item))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Kargo firması"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: carrier,
								onChange: (e) => setCarrier(e.target.value),
								maxLength: 120
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Takip kodu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: trackingCode,
								onChange: (e) => setTrackingCode(e.target.value),
								maxLength: 160
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "Fatura numarası"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: invoiceNumber,
								onChange: (e) => setInvoiceNumber(e.target.value),
								maxLength: 160
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-medium",
								children: "İade tutarı (TL)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								max: selected.total,
								step: "0.01",
								value: refundedAmount,
								onChange: (e) => setRefundedAmount(Number(e.target.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-sm font-medium",
						children: "Yönetici notu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: note,
						onChange: (e) => setNote(e.target.value),
						maxLength: 2e3,
						className: "min-h-32 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Siparişi kaydet"]
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Henüz sipariş yok." })]
	});
}
var COMMON_CONTACT_FIELDS = [
	{
		key: "contactName",
		label: "İlgili kişi"
	},
	{
		key: "email",
		label: "E-posta",
		type: "email"
	},
	{
		key: "phone",
		label: "Telefon",
		type: "tel"
	}
];
var ACTIVE_STATUSES = [
	["active", "Aktif"],
	["inactive", "Pasif"],
	["archived", "Arşiv"]
];
var OPERATION_MODULES = [
	{
		key: "quotes",
		label: "Teklifler",
		group: "Satış",
		singular: "teklif",
		viewPermission: "quotes.view",
		statuses: [
			["new", "Yeni"],
			["reviewing", "İnceleniyor"],
			["priced", "Fiyatlandı"],
			["sent", "Gönderildi"],
			["approved", "Onaylandı"],
			["rejected", "Reddedildi"],
			["converted", "Siparişe dönüştü"]
		],
		fields: [
			...COMMON_CONTACT_FIELDS,
			{
				key: "amount",
				label: "Teklif tutarı",
				type: "number"
			},
			{
				key: "discount",
				label: "İskonto (%)",
				type: "number"
			},
			{
				key: "quantity",
				label: "Miktar",
				type: "number"
			},
			{
				key: "validUntil",
				label: "Geçerlilik tarihi",
				type: "date"
			},
			{
				key: "notes",
				label: "Teklif notu",
				type: "textarea"
			}
		]
	},
	{
		key: "custom_production",
		label: "Özel üretim",
		group: "Satış",
		singular: "özel üretim talebi",
		viewPermission: "custom_production.view",
		statuses: [
			["new", "Yeni"],
			["reviewing", "İnceleniyor"],
			["priced", "Fiyatlandı"],
			["sample", "Numune"],
			["in_production", "Üretimde"],
			["completed", "Tamamlandı"],
			["closed", "Kapandı"]
		],
		fields: [
			...COMMON_CONTACT_FIELDS,
			{
				key: "measurements",
				label: "Ölçüler"
			},
			{
				key: "quantity",
				label: "Adet",
				type: "number"
			},
			{
				key: "amount",
				label: "Fiyat",
				type: "number"
			},
			{
				key: "dueDate",
				label: "Termin",
				type: "date"
			},
			{
				key: "technicalNote",
				label: "Teknik not",
				type: "textarea"
			}
		]
	},
	{
		key: "customers",
		label: "Müşteriler",
		group: "Satış",
		singular: "müşteri",
		viewPermission: "customers.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "email",
				label: "E-posta",
				type: "email"
			},
			{
				key: "phone",
				label: "Telefon",
				type: "tel"
			},
			{
				key: "address",
				label: "Adres",
				type: "textarea"
			},
			{
				key: "group",
				label: "Müşteri grubu"
			},
			{
				key: "tags",
				label: "Etiketler"
			},
			{
				key: "notes",
				label: "Notlar",
				type: "textarea"
			}
		]
	},
	{
		key: "companies",
		label: "Kurumsal müşteriler",
		group: "Satış",
		singular: "firma",
		viewPermission: "companies.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			...COMMON_CONTACT_FIELDS,
			{
				key: "taxOffice",
				label: "Vergi dairesi"
			},
			{
				key: "taxNumber",
				label: "Vergi numarası"
			},
			{
				key: "discount",
				label: "İskonto (%)",
				type: "number"
			},
			{
				key: "paymentTerm",
				label: "Ödeme vadesi"
			},
			{
				key: "billingAddress",
				label: "Fatura adresi",
				type: "textarea"
			}
		]
	},
	{
		key: "inventory",
		label: "Stok",
		group: "Operasyon",
		singular: "stok kaydı",
		viewPermission: "inventory.view",
		statuses: [
			["in_stock", "Stokta"],
			["low", "Kritik"],
			["out", "Tükendi"],
			["counting", "Sayımda"]
		],
		fields: [
			{
				key: "sku",
				label: "SKU"
			},
			{
				key: "quantity",
				label: "Mevcut adet",
				type: "number"
			},
			{
				key: "minimum",
				label: "Minimum stok",
				type: "number"
			},
			{
				key: "unit",
				label: "Birim"
			},
			{
				key: "movementNote",
				label: "Hareket notu",
				type: "textarea"
			}
		]
	},
	{
		key: "warehouses",
		label: "Depolar",
		group: "Operasyon",
		singular: "depo",
		viewPermission: "warehouses.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "manager",
				label: "Sorumlu"
			},
			{
				key: "phone",
				label: "Telefon",
				type: "tel"
			},
			{
				key: "address",
				label: "Adres",
				type: "textarea"
			},
			{
				key: "capacity",
				label: "Kapasite"
			}
		]
	},
	{
		key: "production",
		label: "Üretim",
		group: "Operasyon",
		singular: "üretim emri",
		viewPermission: "production.view",
		statuses: [
			["planned", "Planlandı"],
			["in_production", "Üretimde"],
			["blocked", "Beklemede"],
			["completed", "Tamamlandı"],
			["cancelled", "İptal"]
		],
		fields: [
			{
				key: "quantity",
				label: "Üretim adedi",
				type: "number"
			},
			{
				key: "operation",
				label: "Operasyon"
			},
			{
				key: "staff",
				label: "Personel"
			},
			{
				key: "dueDate",
				label: "Termin",
				type: "date"
			},
			{
				key: "waste",
				label: "Fire",
				type: "number"
			},
			{
				key: "notes",
				label: "Üretim notu",
				type: "textarea"
			}
		]
	},
	{
		key: "shipping",
		label: "Kargo",
		group: "Operasyon",
		singular: "kargo",
		viewPermission: "shipping.view",
		statuses: [
			["waiting", "Bekliyor"],
			["prepared", "Hazırlandı"],
			["shipped", "Gönderildi"],
			["delivered", "Teslim edildi"],
			["cancelled", "İptal"]
		],
		fields: [
			{
				key: "orderNumber",
				label: "Sipariş numarası"
			},
			{
				key: "carrier",
				label: "Kargo firması"
			},
			{
				key: "tracking",
				label: "Takip numarası"
			},
			{
				key: "recipient",
				label: "Alıcı"
			},
			{
				key: "shippedAt",
				label: "Gönderim tarihi",
				type: "date"
			},
			{
				key: "notes",
				label: "Kargo notu",
				type: "textarea"
			}
		]
	},
	{
		key: "pricing",
		label: "Fiyatlandırma",
		group: "Satış",
		singular: "fiyat kuralı",
		viewPermission: "pricing.view_sale",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "salePrice",
				label: "Satış fiyatı",
				type: "number"
			},
			{
				key: "cost",
				label: "Maliyet",
				type: "number"
			},
			{
				key: "wholesale",
				label: "Toptan fiyat",
				type: "number"
			},
			{
				key: "corporate",
				label: "Kurumsal fiyat",
				type: "number"
			},
			{
				key: "campaign",
				label: "Kampanyalı fiyat",
				type: "number"
			},
			{
				key: "notes",
				label: "Fiyat notu",
				type: "textarea"
			}
		]
	},
	{
		key: "discounts",
		label: "İndirimler",
		group: "Satış",
		singular: "indirim",
		viewPermission: "discounts.view",
		statuses: [
			["draft", "Taslak"],
			["active", "Aktif"],
			["inactive", "Pasif"],
			["expired", "Süresi doldu"]
		],
		fields: [
			{
				key: "code",
				label: "İndirim kodu"
			},
			{
				key: "value",
				label: "İndirim değeri",
				type: "number"
			},
			{
				key: "minimum",
				label: "Minimum sepet",
				type: "number"
			},
			{
				key: "usageLimit",
				label: "Kullanım limiti",
				type: "number"
			},
			{
				key: "startDate",
				label: "Başlangıç",
				type: "date"
			},
			{
				key: "endDate",
				label: "Bitiş",
				type: "date"
			}
		]
	},
	{
		key: "blog",
		label: "Blog ve rehber",
		group: "İçerik",
		singular: "yazı",
		viewPermission: "blog.view",
		statuses: [
			["draft", "Taslak"],
			["published", "Yayında"],
			["unpublished", "Yayından kaldırıldı"],
			["archived", "Arşiv"]
		],
		fields: [
			{
				key: "slug",
				label: "URL"
			},
			{
				key: "category",
				label: "Kategori"
			},
			{
				key: "seoTitle",
				label: "SEO başlığı"
			},
			{
				key: "seoDescription",
				label: "SEO açıklaması",
				type: "textarea"
			},
			{
				key: "body",
				label: "İçerik",
				type: "textarea"
			}
		]
	},
	{
		key: "reviews",
		label: "Değerlendirmeler",
		group: "İçerik",
		singular: "değerlendirme",
		viewPermission: "reviews.view",
		statuses: [
			["pending", "Bekliyor"],
			["approved", "Onaylandı"],
			["rejected", "Reddedildi"]
		],
		fields: [
			{
				key: "customer",
				label: "Müşteri"
			},
			{
				key: "rating",
				label: "Puan",
				type: "number"
			},
			{
				key: "comment",
				label: "Yorum",
				type: "textarea"
			},
			{
				key: "reply",
				label: "Yanıt",
				type: "textarea"
			}
		]
	},
	{
		key: "forms",
		label: "Form talepleri",
		group: "İçerik",
		singular: "form talebi",
		viewPermission: "forms.view_contact",
		viewPermissions: [
			"forms.view_contact",
			"forms.view_quotes",
			"forms.view_complaints",
			"forms.view_design"
		],
		statuses: [
			["new", "Yeni"],
			["assigned", "Atandı"],
			["replied", "Yanıtlandı"],
			["closed", "Kapandı"]
		],
		fields: [
			...COMMON_CONTACT_FIELDS,
			{
				key: "formType",
				label: "Form türü"
			},
			{
				key: "orderNumber",
				label: "Sipariş numarası"
			},
			{
				key: "message",
				label: "Mesaj",
				type: "textarea"
			},
			{
				key: "internalNote",
				label: "İç not",
				type: "textarea"
			}
		]
	},
	{
		key: "newsletter",
		label: "Bülten",
		group: "İçerik",
		singular: "bülten kaydı",
		viewPermission: "newsletter.view_subscribers",
		statuses: [
			["active", "Abone"],
			["unsubscribed", "Ayrıldı"],
			["draft", "Kampanya taslağı"],
			["sent", "Kampanya gönderildi"]
		],
		fields: [
			{
				key: "email",
				label: "E-posta",
				type: "email"
			},
			{
				key: "subject",
				label: "Kampanya konusu"
			},
			{
				key: "content",
				label: "Kampanya içeriği",
				type: "textarea"
			},
			{
				key: "consentDate",
				label: "Onay tarihi",
				type: "date"
			}
		]
	},
	{
		key: "finance",
		label: "Finans",
		group: "Satış",
		singular: "finans kaydı",
		viewPermission: "finance.view",
		statuses: [
			["pending", "Bekliyor"],
			["paid", "Ödendi"],
			["refunded", "İade edildi"],
			["cancelled", "İptal"]
		],
		fields: [
			{
				key: "type",
				label: "İşlem türü"
			},
			{
				key: "amount",
				label: "Tutar",
				type: "number"
			},
			{
				key: "cost",
				label: "Maliyet",
				type: "number"
			},
			{
				key: "invoice",
				label: "Fatura numarası"
			},
			{
				key: "date",
				label: "İşlem tarihi",
				type: "date"
			},
			{
				key: "notes",
				label: "Finans notu",
				type: "textarea"
			}
		]
	},
	{
		key: "payment_settings",
		label: "Ödeme ayarları",
		group: "Ayarlar",
		singular: "ödeme yöntemi",
		viewPermission: "payment_settings.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "provider",
				label: "Sağlayıcı"
			},
			{
				key: "method",
				label: "Ödeme yöntemi"
			},
			{
				key: "account",
				label: "Hesap / tanım"
			},
			{
				key: "installments",
				label: "Taksit seçenekleri"
			},
			{
				key: "notes",
				label: "Yönetim notu",
				type: "textarea"
			}
		]
	},
	{
		key: "delivery_settings",
		label: "Teslimat ayarları",
		group: "Ayarlar",
		singular: "teslimat kuralı",
		viewPermission: "delivery_settings.manage_carriers",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "carrier",
				label: "Kargo firması"
			},
			{
				key: "fee",
				label: "Kargo ücreti",
				type: "number"
			},
			{
				key: "freeLimit",
				label: "Ücretsiz kargo limiti",
				type: "number"
			},
			{
				key: "deliveryTime",
				label: "Teslimat süresi"
			},
			{
				key: "region",
				label: "Bölge"
			},
			{
				key: "rule",
				label: "Kural",
				type: "textarea"
			}
		]
	},
	{
		key: "tax",
		label: "Vergi",
		group: "Ayarlar",
		singular: "vergi kuralı",
		viewPermission: "tax.view_rates",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "rate",
				label: "KDV oranı (%)",
				type: "number"
			},
			{
				key: "class",
				label: "Vergi sınıfı"
			},
			{
				key: "scope",
				label: "Kapsam"
			},
			{
				key: "notes",
				label: "Açıklama",
				type: "textarea"
			}
		]
	},
	{
		key: "domain",
		label: "Domain",
		group: "Ayarlar",
		singular: "domain kaydı",
		viewPermission: "domain.view",
		statuses: [
			["pending", "Doğrulama bekliyor"],
			["active", "Aktif"],
			["redirected", "Yönlendiriliyor"],
			["inactive", "Pasif"]
		],
		fields: [
			{
				key: "hostname",
				label: "Alan adı"
			},
			{
				key: "target",
				label: "Yönlendirme hedefi"
			},
			{
				key: "ssl",
				label: "SSL durumu"
			},
			{
				key: "notes",
				label: "Not",
				type: "textarea"
			}
		]
	},
	{
		key: "integrations",
		label: "Entegrasyonlar",
		group: "Ayarlar",
		singular: "entegrasyon",
		viewPermission: "integrations.view",
		statuses: [
			["active", "Aktif"],
			["inactive", "Pasif"],
			["error", "Hata"]
		],
		fields: [
			{
				key: "provider",
				label: "Sağlayıcı"
			},
			{
				key: "endpoint",
				label: "Uç nokta"
			},
			{
				key: "webhook",
				label: "Webhook"
			},
			{
				key: "lastSync",
				label: "Son eşitleme"
			},
			{
				key: "notes",
				label: "Not",
				type: "textarea"
			}
		]
	},
	{
		key: "pixels",
		label: "Piksel ve reklam",
		group: "Ayarlar",
		singular: "ölçüm kaydı",
		viewPermission: "pixels.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "provider",
				label: "Platform"
			},
			{
				key: "publicId",
				label: "Piksel / ölçüm kimliği"
			},
			{
				key: "events",
				label: "Olaylar"
			},
			{
				key: "notes",
				label: "Not",
				type: "textarea"
			}
		]
	},
	{
		key: "media",
		label: "Dosyalar",
		group: "İçerik",
		singular: "dosya kaydı",
		viewPermission: "media.view",
		statuses: ACTIVE_STATUSES,
		fields: [
			{
				key: "url",
				label: "Dosya adresi"
			},
			{
				key: "folder",
				label: "Klasör"
			},
			{
				key: "alt",
				label: "Alternatif metin"
			},
			{
				key: "contentType",
				label: "Dosya türü"
			},
			{
				key: "notes",
				label: "Not",
				type: "textarea"
			}
		]
	}
];
function operationViewPermissions(module) {
	return module.viewPermissions ?? [module.viewPermission];
}
function OperationsAdmin({ records, setRecords, access, identity, refreshAudit }) {
	const modules = OPERATION_MODULES.filter((module) => identity.isOwner || operationViewPermissions(module).some((permission) => identity.permissions.includes(permission)));
	const [moduleKey, setModuleKey] = (0, import_react.useState)(modules[0]?.key ?? "quotes");
	const config = modules.find((x) => x.key === moduleKey) ?? modules[0];
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const emptyDraft = (next) => ({
		id: void 0,
		title: "",
		reference: "",
		status: next.statuses[0][0],
		assignedId: null,
		category: "",
		warehouse: "",
		brand: "",
		customerGroup: "",
		salesChannel: "",
		data: {}
	});
	const [draft, setDraft] = (0, import_react.useState)(() => emptyDraft(config));
	const [savedSignature, setSavedSignature] = (0, import_react.useState)(() => JSON.stringify(emptyDraft(config)));
	if (!config) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bu alanda görüntüleme yetkiniz yok." });
	const filtered = records.filter((record) => record.module === config.key).filter((record) => {
		const text = `${record.title} ${record.reference ?? ""} ${Object.values(record.data).join(" ")}`;
		return (statusFilter === "all" || record.status === statusFilter) && text.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"));
	});
	const dirty = JSON.stringify(draft) !== savedSignature;
	function chooseModule(next) {
		setModuleKey(next.key);
		setSelectedId(null);
		const empty = emptyDraft(next);
		setDraft(empty);
		setSavedSignature(JSON.stringify(empty));
		setQuery("");
		setStatusFilter("all");
	}
	function chooseRecord(record) {
		setSelectedId(record.id);
		const nextDraft = {
			id: record.id,
			title: record.title,
			reference: record.reference ?? "",
			status: record.status,
			assignedId: record.assignedId,
			category: record.category ?? "",
			warehouse: record.warehouse ?? "",
			brand: record.brand ?? "",
			customerGroup: record.customerGroup ?? "",
			salesChannel: record.salesChannel ?? "",
			data: record.data
		};
		setDraft(nextDraft);
		setSavedSignature(JSON.stringify(nextDraft));
	}
	function newRecord() {
		setSelectedId(null);
		const empty = emptyDraft(config);
		setDraft(empty);
		setSavedSignature(JSON.stringify(empty));
	}
	function setData(key, value) {
		setDraft((current) => ({
			...current,
			data: {
				...current.data,
				[key]: value
			}
		}));
	}
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const result = await saveAdminRecord({ data: {
				...draft,
				module: config.key
			} });
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const next = {
				...draft,
				id: result.id,
				module: config.key,
				reference: draft.reference || null,
				ownerId: records.find((x) => x.id === draft.id)?.ownerId ?? identity.id,
				assignedId: draft.assignedId,
				category: draft.category || null,
				warehouse: draft.warehouse || null,
				brand: draft.brand || null,
				customerGroup: draft.customerGroup || null,
				salesChannel: draft.salesChannel || null,
				createdAt: records.find((x) => x.id === draft.id)?.createdAt ?? now,
				updatedAt: now
			};
			setRecords([next, ...records.filter((x) => x.id !== next.id)]);
			setSelectedId(next.id);
			const savedDraft = {
				...draft,
				id: next.id
			};
			setDraft(savedDraft);
			setSavedSignature(JSON.stringify(savedDraft));
			await refreshAudit();
			toast.success(`${config.label} kaydı kaydedildi.`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Kayıt kaydedilemedi.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!draft.id || !confirm(`“${draft.title}” kalıcı olarak silinsin mi?`)) return;
		setBusy(true);
		try {
			await deleteAdminRecord({ data: {
				id: draft.id,
				module: config.key
			} });
			setRecords(records.filter((x) => x.id !== draft.id));
			newRecord();
			await refreshAudit();
			toast.success("Kayıt silindi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Kayıt silinemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border border-border bg-bg-elevated p-3",
			children: [
				"Satış",
				"Operasyon",
				"İçerik",
				"Ayarlar"
			].map((group) => {
				const groupModules = modules.filter((item) => item.group === group);
				if (!groupModules.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-20 text-xs font-medium text-fg-muted",
						children: group
					}), groupModules.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => chooseModule(item),
						className: cn("min-h-11 rounded border px-3 text-sm", item.key === config.key ? "border-[#102f25] bg-[#102f25] text-white" : "border-border bg-bg-elevated hover:bg-bg-wash"),
						children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs opacity-60",
							children: records.filter((record) => record.module === item.key).length
						})]
					}, item.key))]
				}, group);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 xl:grid-cols-[22rem_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-b border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": `${config.label} içinde ara`,
								placeholder: "Ara",
								value: query,
								onChange: (e) => setQuery(e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: newRecord,
								children: "Yeni"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Duruma göre filtrele",
							value: statusFilter,
							onChange: (e) => setStatusFilter(e.target.value),
							className: "h-11 w-full border border-border-strong bg-bg-elevated px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Tüm durumlar"
							}), config.statuses.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: label
							}, value))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-fg-muted",
							role: "status",
							children: [filtered.length, " kayıt"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[65vh] divide-y divide-border overflow-y-auto",
					children: filtered.length ? filtered.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => chooseRecord(record),
						className: cn("min-h-16 w-full p-3 text-left", selectedId === record.id ? "bg-accent/10" : "hover:bg-bg-wash"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: record.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-fg-muted",
							children: [config.statuses.find(([value]) => value === record.status)?.[1] ?? record.status, record.reference ? ` · ${record.reference}` : ""]
						})]
					}, record.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-5 text-sm text-fg-muted",
						children: "Bu görünümde kayıt yok."
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "border border-border bg-bg-elevated p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-fg-muted",
							children: draft.id ? draft.reference || draft.id : `Yeni ${config.singular}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-3xl",
							children: draft.id ? draft.title : `${config.singular[0].toLocaleUpperCase("tr-TR")}${config.singular.slice(1)} oluştur`
						})] }), dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-amber-100 px-3 py-1 text-xs",
							children: "Kaydedilmemiş değişiklik"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Başlık / ad",
								value: draft.title,
								set: (title) => setDraft({
									...draft,
									title
								}),
								max: 160
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Durum"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: draft.status,
									onChange: (e) => setDraft({
										...draft,
										status: e.target.value
									}),
									className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
									children: config.statuses.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value,
										children: label
									}, value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Referans"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.reference,
									onChange: (e) => setDraft({
										...draft,
										reference: e.target.value
									}),
									maxLength: 80
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: "Atanan kullanıcı"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: draft.assignedId ?? "",
									onChange: (e) => setDraft({
										...draft,
										assignedId: e.target.value || null
									}),
									className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Atanmamış"
									}), access.users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: user.id,
										children: user.display_name
									}, user.id))]
								})]
							}),
							config.fields.map((field) => {
								const value = draft.data[field.key];
								const stringValue = value == null ? "" : String(value);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: field.type === "textarea" ? "block sm:col-span-2" : "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-2 block text-sm font-medium",
										children: field.label
									}), field.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: stringValue,
										onChange: (e) => setData(field.key, e.target.value),
										maxLength: 4e3,
										className: "min-h-28 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: field.type ?? "text",
										value: stringValue,
										onChange: (e) => setData(field.key, field.type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value),
										maxLength: field.type === "number" ? void 0 : 500
									})]
								}, field.key);
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-5 border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm font-medium",
							children: "Kapsam ve sınıflandırma"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: [
								["category", "Kategori"],
								["warehouse", "Depo"],
								["brand", "Marka"],
								["customerGroup", "Müşteri grubu"],
								["salesChannel", "Satış kanalı"]
							].map(([key, fieldLabel]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-2 block text-sm font-medium",
									children: fieldLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft[key],
									onChange: (e) => setDraft({
										...draft,
										[key]: e.target.value
									}),
									maxLength: 100
								})]
							}, key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							disabled: !draft.id || busy,
							onClick: () => void remove(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Sil"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: busy || !draft.title.trim(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }),
								" ",
								busy ? "Kaydediliyor…" : "Kaydet"
							]
						})]
					})
				]
			})]
		})]
	});
}
function AnalyticsAdmin({ records, orders }) {
	const amount = (record, key = "amount") => {
		const value = record.data[key];
		return typeof value === "number" ? value : Number(value) || 0;
	};
	const quotes = records.filter((x) => x.module === "quotes");
	const customers = records.filter((x) => x.module === "customers" || x.module === "companies");
	const inventory = records.filter((x) => x.module === "inventory");
	const finance = records.filter((x) => x.module === "finance");
	const revenue = finance.filter((x) => x.status === "paid").reduce((sum, record) => sum + amount(record), 0);
	const costs = finance.reduce((sum, record) => sum + amount(record, "cost"), 0);
	const openOrders = orders.filter((order) => ![
		"completed",
		"cancelled",
		"archived"
	].includes(order.status));
	const moduleCounts = OPERATION_MODULES.map((module) => ({
		label: module.label,
		count: records.filter((record) => record.module === module.key).length,
		open: records.filter((record) => record.module === module.key && ![
			"completed",
			"closed",
			"cancelled",
			"archived",
			"inactive",
			"rejected"
		].includes(record.status)).length
	})).filter((item) => item.count > 0);
	function exportCsv() {
		const quote = (value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
		const rows = [[
			"Modül",
			"Başlık",
			"Referans",
			"Durum",
			"Güncelleme"
		], ...records.map((record) => [
			OPERATION_MODULES.find((module) => module.key === record.module)?.label ?? record.module,
			record.title,
			record.reference ?? "",
			record.status,
			record.updatedAt
		])];
		const blob = new Blob([`\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = `sweb-yonetim-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: exportCsv,
					disabled: !records.length,
					children: "CSV dışa aktar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Açık sipariş",
						value: `${openOrders.length}`,
						note: `${orders.length} toplam sipariş`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Teklif hacmi",
						value: formatPrice(quotes.reduce((sum, record) => sum + amount(record), 0)),
						note: `${quotes.length} teklif`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Müşteri",
						value: `${customers.length}`,
						note: "Bireysel ve kurumsal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Kritik stok",
						value: `${inventory.filter((x) => ["low", "out"].includes(x.status)).length}`,
						note: `${inventory.length} stok kaydı`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Tahsilat",
						value: formatPrice(revenue),
						note: `${finance.filter((x) => x.status === "paid").length} ödeme`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Kayıtlı maliyet",
						value: formatPrice(costs),
						note: `Brüt fark ${formatPrice(revenue - costs)}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b border-border p-5 font-display text-2xl",
					children: "İş yükü dağılımı"
				}), moduleCounts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: moduleCounts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-fg-muted",
								children: [item.open, " açık"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [item.count, " toplam"]
							})
						]
					}, item.label))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-5 text-sm text-fg-muted",
					children: "Analiz oluşturmak için henüz operasyon kaydı yok."
				})]
			})
		]
	});
}
function SiteConfigEditor({ mode, value, onSaved, refreshAudit }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const next = await saveAdminSiteConfig({ data: draft });
			setDraft(next);
			onSaved(next);
			await refreshAudit();
			toast.success(mode === "seo" ? "Site SEO ayarları kaydedildi." : "Site içeriği kaydedildi.");
		} catch {
			toast.error("Ayarlar kaydedilemedi. Alanları kontrol edin.");
		} finally {
			setBusy(false);
		}
	}
	const identity = (key, next) => setDraft({
		...draft,
		identity: {
			...draft.identity,
			[key]: next
		}
	});
	const storefront = (key, next) => setDraft({
		...draft,
		storefront: {
			...draft.storefront,
			[key]: next
		}
	});
	const seo = (key, next) => setDraft({
		...draft,
		seo: {
			...draft.seo,
			[key]: next
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "border border-border bg-bg-elevated p-5 sm:p-7",
		children: [mode === "content" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Marka ve iletişim"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Marka adı",
						value: draft.identity.name,
						set: (x) => identity("name", x),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "E-posta",
						value: draft.identity.email,
						set: (x) => identity("email", x),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Hukuki bildirim e-postası",
						value: draft.identity.legalEmail,
						set: (x) => identity("legalEmail", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Kısa açıklama",
						value: draft.identity.tagline,
						set: (x) => identity("tagline", x),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Telefon",
						value: draft.identity.phone,
						set: (x) => identity("phone", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Atölye adresi",
						value: draft.identity.atelier,
						set: (x) => identity("atelier", x),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Çalışma saatleri",
						value: draft.identity.hours,
						set: (x) => identity("hours", x),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Resmî unvan",
						value: draft.identity.legalName,
						set: (x) => identity("legalName", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "MERSİS numarası",
						value: draft.identity.mersisNumber,
						set: (x) => identity("mersisNumber", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Vergi dairesi",
						value: draft.identity.taxOffice,
						set: (x) => identity("taxOffice", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Vergi numarası",
						value: draft.identity.taxNumber,
						set: (x) => identity("taxNumber", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Resmî açık adres",
						value: draft.identity.legalAddress,
						set: (x) => identity("legalAddress", x)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "IBAN",
						value: draft.identity.iban,
						set: (x) => identity("iban", x)
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-t border-border pt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Vitrin metinleri"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Üst duyuru",
							value: draft.storefront.announcement,
							set: (x) => storefront("announcement", x),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Ana sayfa başlığı",
							value: draft.storefront.heroTitle,
							set: (x) => storefront("heroTitle", x),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Ana sayfa butonu",
							value: draft.storefront.heroButton,
							set: (x) => storefront("heroButton", x),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Footer kısa başlığı",
							value: draft.storefront.footerKicker,
							set: (x) => storefront("footerKicker", x),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Footer çağrısı",
							value: draft.storefront.footerTitle,
							set: (x) => storefront("footerTitle", x),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Footer butonu",
							value: draft.storefront.footerButton,
							set: (x) => storefront("footerButton", x),
							required: true
						})
					]
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_22rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: `Varsayılan SEO başlığı · ${draft.seo.defaultTitle.length}/70`,
						value: draft.seo.defaultTitle,
						set: (x) => seo("defaultTitle", x),
						required: true,
						max: 70
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: `Varsayılan meta açıklama · ${draft.seo.defaultDescription.length}/170`,
						value: draft.seo.defaultDescription,
						set: (x) => seo("defaultDescription", x),
						required: true,
						max: 170,
						multiline: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: "Sosyal paylaşım görsel yolu",
						value: draft.seo.socialImage,
						set: (x) => seo("socialImage", x),
						required: true
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-fit rounded border border-border bg-white p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg text-[#1a0dab]",
						children: [
							draft.seo.defaultTitle,
							" — ",
							draft.identity.name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#006621]",
						children: new URL(SITE_ORIGIN).host
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[#4d5156]",
						children: draft.seo.defaultDescription
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-7 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Değişiklikleri kaydet"]
			})
		})]
	});
}
function NavigationEditor({ value, onSaved, refreshAudit }) {
	const [links, setLinks] = (0, import_react.useState)(value.links);
	const [q, setQ] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const visible = links.filter((x) => `${x.label} ${x.path}`.toLocaleLowerCase("tr-TR").includes(q.toLocaleLowerCase("tr-TR")));
	function change(path, patch) {
		setLinks(links.map((x) => x.path === path ? {
			...x,
			...patch
		} : x));
	}
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const next = await saveAdminSiteConfig({ data: {
				...value,
				links
			} });
			onSaved(next);
			setLinks(next.links);
			await refreshAudit();
			toast.success("Navbar ve footer kaydedildi.");
		} catch {
			toast.error("Menüler kaydedilemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "border border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-bg-elevated p-4 sm:flex-row sm:items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "flex-1",
					placeholder: "Sayfa veya bağlantı ara",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-fg-muted",
					children: [visible.length, " bağlantı"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: busy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Menüleri kaydet"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 p-4 lg:grid-cols-[minmax(14rem,1fr)_10rem_10rem_auto] lg:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
						label: item.path,
						value: item.label,
						set: (x) => change(item.path, { label: x }),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-xs text-fg-muted",
						children: "Navbar grubu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: item.menuGroup,
						onChange: (e) => change(item.path, { menuGroup: e.target.value }),
						className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
						children: [
							"Ana",
							"Teklif",
							"Rehberler",
							"Destek",
							"Bilgi"
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-xs text-fg-muted",
						children: "Footer grubu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: item.footerGroup ?? "",
						onChange: (e) => change(item.path, { footerGroup: e.target.value || null }),
						className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Gösterme"
						}), [
							"Mağaza",
							"Yardım",
							"Hukuki"
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: item.visible,
							onChange: (e) => change(item.path, { visible: e.target.checked })
						}), "Yayında"]
					})
				]
			}, item.path))
		})]
	});
}
function ConfigField({ label, value, set, required = false, max, multiline = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-2 block text-sm font-medium",
			children: label
		}), multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => set(e.target.value),
			required,
			maxLength: max,
			className: "min-h-28 w-full border border-border-strong bg-bg-elevated p-3 text-sm"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => set(e.target.value),
			required,
			maxLength: max
		})]
	});
}
function orderStatusLabel(status) {
	return {
		new: "Yeni",
		reviewed: "İncelendi",
		confirmed: "Onaylandı",
		preparing: "Hazırlanıyor",
		shipped: "Kargoda",
		completed: "Tamamlandı",
		cancelled: "İptal",
		archived: "Arşiv"
	}[status];
}
function paymentStatusLabel(status) {
	return {
		pending: "Bekliyor",
		paid: "Ödendi",
		failed: "Başarısız",
		partially_refunded: "Kısmen iade edildi",
		refunded: "İade edildi"
	}[status];
}
function shippingStatusLabel(status) {
	return {
		pending: "Bekliyor",
		preparing: "Hazırlanıyor",
		shipped: "Gönderildi",
		delivered: "Teslim edildi",
		cancelled: "İptal"
	}[status];
}
function ProductSeo({ items, setItems, refreshAudit }) {
	const [q, setQ] = (0, import_react.useState)(""), [selected, setSelected] = (0, import_react.useState)(items[0] ?? null);
	const filtered = (0, import_react.useMemo)(() => {
		const n = q.toLocaleLowerCase("tr-TR");
		return items.filter((x) => `${x.name} ${x.id} ${x.lineTitle}`.toLocaleLowerCase("tr-TR").includes(n));
	}, [items, q]);
	const visibleItems = filtered.slice(0, 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[22rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-border bg-bg-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative border-b border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-6 left-6 size-4 text-fg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-10",
						placeholder: "Ürün ara",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-fg-muted",
						children: [
							filtered.length,
							" sonuç",
							filtered.length > 100 ? " · İlk 100 gösteriliyor" : ""
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[70vh] overflow-y-auto divide-y divide-border",
				children: visibleItems.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelected(x),
					className: cn("w-full p-3 text-left", selected?.productKey === x.productKey ? "bg-accent/10" : "hover:bg-bg-wash"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: x.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 truncate font-mono text-xs text-fg-muted",
						children: [
							x.lineKey.toUpperCase(),
							" · ",
							x.id
						]
					})]
				}, x.productKey))
			})]
		}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoEditor, {
			item: selected,
			onSaved: async (next) => {
				setSelected(next);
				setItems(items.map((x) => x.productKey === next.productKey ? next : x));
				await refreshAudit();
			}
		}, `${selected.productKey}:${selected.updatedAt}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ürün seçin." })]
	});
}
function SeoEditor({ item, onSaved }) {
	const [name, setName] = (0, import_react.useState)(item.name), [price, setPrice] = (0, import_react.useState)(item.price == null ? "" : String(item.price)), [status, setStatus] = (0, import_react.useState)(item.status), [title, setTitle] = (0, import_react.useState)(item.seoTitle), [description, setDescription] = (0, import_react.useState)(item.seoDescription), [alt, setAlt] = (0, import_react.useState)(item.imageAlt), [busy, setBusy] = (0, import_react.useState)(false);
	async function save(e) {
		e.preventDefault();
		const p = price.trim() === "" ? null : Number(price.replace(",", "."));
		if (p !== null && !Number.isFinite(p)) return toast.error("Fiyat geçerli değil.");
		setBusy(true);
		try {
			await updateAdminProduct({ data: {
				productKey: item.productKey,
				name: name.trim(),
				price: p,
				status,
				seoTitle: title.trim(),
				seoDescription: description.trim(),
				imageAlt: alt.trim()
			} });
			await onSaved({
				...item,
				name: name.trim(),
				price: p,
				status,
				seoTitle: title.trim(),
				seoDescription: description.trim(),
				imageAlt: alt.trim(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast.success("Ürün ve SEO bilgileri kaydedildi.");
		} catch {
			toast.error("Kayıt tamamlanamadı.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "border border-border bg-bg-elevated p-5 sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[12rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.image,
					alt: "",
					className: "aspect-square w-full bg-bg-wash object-contain p-3",
					width: 1500,
					height: 1500
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ürün adı",
							value: name,
							set: setName,
							max: 120
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Fiyat (TL)",
							value: price,
							set: setPrice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-sm font-medium",
							children: "Yayın durumu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
							value: status,
							onChange: (e) => setStatus(e.target.value),
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
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "self-end text-xs text-fg-muted",
							children: ["Kaynak fiyat: ", item.basePrice == null ? "Yok" : formatPrice(item.basePrice)]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-7 border-t border-border pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Arama görünümü"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: `SEO başlığı · ${title.length}/70`,
							value: title,
							set: setTitle,
							max: 70
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mb-2 block text-sm font-medium",
								children: [
									"Meta açıklama · ",
									description.length,
									"/170"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "min-h-24 w-full border border-border-strong bg-bg-elevated p-3 text-sm",
								maxLength: 170,
								value: description,
								onChange: (e) => setDescription(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Görsel alt metni",
							value: alt,
							set: setAlt,
							max: 160
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded border border-border bg-white p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg text-[#1a0dab]",
									children: [title || name, " — Sweb"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-[#006621]",
									children: [
										new URL(SITE_ORIGIN).host,
										"/",
										publicLinePath(item.lineKey),
										"/",
										item.id
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-[#4d5156]",
									children: description
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: busy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Tüm değişiklikleri kaydet"]
				})
			})
		]
	});
}
function publicLinePath(lineKey) {
	return {
		sweb: "organizer",
		slac: "hediye-setleri",
		clik: "saat-mucevher-kutulari",
		desq: "ofis"
	}[lineKey] ?? lineKey;
}
function Scripts$1({ scripts, setScripts, refreshAudit }) {
	const [editing, setEditing] = (0, import_react.useState)(null), [name, setName] = (0, import_react.useState)(""), [placement, setPlacement] = (0, import_react.useState)("head"), [code, setCode] = (0, import_react.useState)(""), [active, setActive] = (0, import_react.useState)(false), [busy, setBusy] = (0, import_react.useState)(false);
	function load(x) {
		setEditing(x);
		setName(x?.name ?? "");
		setPlacement(x?.placement ?? "head");
		setCode(x?.code ?? "");
		setActive(x?.active ?? false);
	}
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await saveAdminScript({ data: {
				id: editing?.id,
				name,
				placement,
				code,
				active
			} });
			setScripts(await getAdminScripts());
			await refreshAudit();
			load(null);
			toast.success("Site kodu kaydedildi.");
		} catch {
			toast.error("Site kodu kaydedilemedi.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!editing || !confirm(`“${editing.name}” kodu kalıcı olarak silinsin mi?`)) return;
		setBusy(true);
		try {
			await deleteAdminScript({ data: { id: editing.id } });
			setScripts(await getAdminScripts());
			await refreshAudit();
			load(null);
			toast.success("Site kodu silindi.");
		} catch {
			toast.error("Silinemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-border bg-bg-elevated p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => load(null),
				children: "Yeni kod ekle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-border",
				children: scripts.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => load(x),
					className: "w-full py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: x.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: [
							x.placement === "head" ? "Sayfa başı" : "Sayfa sonu",
							" ·",
							" ",
							x.active ? "Etkin" : "Kapalı"
						]
					})]
				}, x.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "border border-border bg-bg-elevated p-5 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: editing ? "Kodu düzenle" : "Yeni site kodu"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kod adı",
						value: name,
						set: setName,
						max: 80
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-sm font-medium",
						children: "Yerleşim"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: placement,
						onChange: (e) => setPlacement(e.target.value),
						className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "head",
							children: "Sayfa başı"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "body",
							children: "Sayfa sonu"
						})]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 block text-sm font-medium",
						children: "JavaScript kodu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "min-h-72 w-full border border-border-strong bg-[#102f25] p-4 font-mono text-xs text-white",
						value: code,
						onChange: (e) => setCode(e.target.value),
						placeholder: "Etiket olmadan JavaScript kodunu girin",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 flex items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: active,
						onChange: (e) => setActive(e.target.checked)
					}), "Kod sitede etkin"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-between",
					children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "text-danger",
						onClick: () => void remove(),
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Sil"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Kaydet"]
					})]
				})
			]
		})]
	});
}
function Audit({ entries }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "divide-y divide-border border border-border bg-bg-elevated",
		children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "grid gap-1 p-4 sm:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: label(e.action)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-xs text-fg-muted",
				children: e.productKey
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-fg-muted",
				children: new Date(e.createdAt).toLocaleString("tr-TR")
			})]
		}, e.id))
	});
}
function RolesAdmin({ access, refresh }) {
	const [selectedId, setSelectedId] = (0, import_react.useState)(access.roles[0]?.id ?? null);
	const selected = access.roles.find((x) => x.id === selectedId) ?? null;
	const [name, setName] = (0, import_react.useState)(selected?.name ?? "");
	const [description, setDescription] = (0, import_react.useState)(selected?.description ?? "");
	const [rules, setRules] = (0, import_react.useState)(selected?.rules ?? []);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function choose(id) {
		const role = access.roles.find((x) => x.id === id);
		setSelectedId(id);
		setName(role?.name ?? "");
		setDescription(role?.description ?? "");
		setRules(role?.rules ?? []);
	}
	function updateRule(permission, patch) {
		const next = {
			...rules.find((x) => x.permission === permission) ?? {
				permission,
				scope: "all",
				approval: "deny"
			},
			...patch
		};
		setRules([...rules.filter((x) => x.permission !== permission), next]);
	}
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await saveAdminRole({ data: {
				id: selectedId ?? void 0,
				name,
				description,
				rules
			} });
			await refresh();
			toast.success("Rol ve yetkiler kaydedildi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Rol kaydedilemedi.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!selectedId || !confirm(`“${name}” rolü silinsin mi?`)) return;
		setBusy(true);
		try {
			await deleteAdminRole({ data: { id: selectedId } });
			choose(null);
			await refresh();
			toast.success("Rol silindi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Rol silinemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[18rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "h-fit border border-border bg-bg-elevated p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => choose(null),
				children: "Yeni rol"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-border",
				children: access.roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => choose(role.id),
					className: cn("w-full px-2 py-3 text-left", selectedId === role.id && "bg-accent/10"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: role.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: [role.rules.filter((x) => x.approval !== "deny").length, " yetki"]
					})]
				}, role.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border border-border bg-bg-elevated p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Rol adı",
							value: name,
							set: setName,
							max: 80
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigField, {
							label: "Açıklama",
							value: description,
							set: setDescription
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-fg-muted",
						children: "Her izin için kapsam ve işlem onayı ayrı belirlenir."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "space-y-2",
					children: PERMISSION_MODULES.map((module) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "border border-border bg-bg-elevated",
						open: module.key === "products" || module.key === "orders",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "cursor-pointer px-5 py-4 font-medium",
							children: [module.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-xs font-normal text-fg-muted",
								children: [module.permissions.length, " işlem"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border border-t border-border",
							children: module.permissions.map((permission) => {
								const rule = rules.find((x) => x.permission === permission.key) ?? {
									permission: permission.key,
									scope: "none",
									approval: "deny"
								};
								const needsValue = [
									"category",
									"warehouse",
									"brand",
									"customer_group",
									"sales_channel"
								].includes(rule.scope);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 p-4 lg:grid-cols-[minmax(15rem,1fr)_12rem_12rem_14rem] lg:items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: permission.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-fg-muted",
											children: permission.key
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: rule.scope,
											onChange: (e) => updateRule(permission.key, { scope: e.target.value }),
											className: "h-10 border border-border-strong bg-bg-elevated px-2 text-sm",
											children: PERMISSION_SCOPES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: x.value,
												children: x.label
											}, x.value))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: rule.scopeValue ?? "",
											onChange: (e) => updateRule(permission.key, { scopeValue: e.target.value }),
											disabled: !needsValue,
											placeholder: needsValue ? "Kapsam değeri" : "Ek değer yok"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: rule.approval,
											onChange: (e) => updateRule(permission.key, { approval: e.target.value }),
											className: "h-10 border border-border-strong bg-bg-elevated px-2 text-sm",
											children: APPROVAL_MODES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: x.value,
												children: x.label
											}, x.value))
										})
									]
								}, permission.key);
							})
						})]
					}, module.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-3 flex justify-between border border-border bg-bg-elevated p-4 shadow-lg",
					children: [selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "text-danger",
						onClick: () => void remove(),
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Sil"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy || !name.trim(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Rolü kaydet"]
					})]
				})
			]
		})]
	});
}
function UsersAdmin({ access, refresh }) {
	const [selectedId, setSelectedId] = (0, import_react.useState)(null), [username, setUsername] = (0, import_react.useState)(""), [displayName, setDisplayName] = (0, import_react.useState)(""), [password, setPassword] = (0, import_react.useState)(""), [roleId, setRoleId] = (0, import_react.useState)(access.roles.find((x) => x.role_key === "viewer")?.id ?? access.roles[0]?.id ?? ""), [active, setActive] = (0, import_react.useState)(true), [locked, setLocked] = (0, import_react.useState)(false), [twoFactorRequired, setTwoFactorRequired] = (0, import_react.useState)(false), [busy, setBusy] = (0, import_react.useState)(false);
	function choose(id) {
		const user = access.users.find((x) => x.id === id);
		setSelectedId(id);
		setUsername(user?.username ?? "");
		setDisplayName(user?.display_name ?? "");
		setPassword("");
		setRoleId(user?.role_id ?? access.roles.find((x) => x.role_key === "viewer")?.id ?? access.roles[0]?.id ?? "");
		setActive(user?.active ?? true);
		setLocked(user?.locked ?? false);
		setTwoFactorRequired(user?.two_factor_required ?? false);
	}
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await saveAdminUser({ data: {
				id: selectedId ?? void 0,
				username,
				displayName,
				password: password || void 0,
				roleId,
				active,
				locked,
				twoFactorRequired
			} });
			await refresh();
			toast.success("Kullanıcı kaydedildi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Kullanıcı kaydedilemedi.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!selectedId || !confirm(`“${displayName}” kullanıcısı silinsin mi?`)) return;
		setBusy(true);
		try {
			await deleteAdminUser({ data: { id: selectedId } });
			choose(null);
			await refresh();
			toast.success("Kullanıcı silindi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Kullanıcı silinemedi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "h-fit border border-border bg-bg-elevated p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => choose(null),
				children: "Yeni kullanıcı"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-border",
				children: access.users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => choose(user.id),
					className: cn("w-full px-2 py-3 text-left", selectedId === user.id && "bg-accent/10"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: user.display_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-fg-muted",
						children: [
							"@",
							user.username,
							" · ",
							user.role_name
						]
					})]
				}, user.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "h-fit border border-border bg-bg-elevated p-5 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: selectedId ? "Kullanıcıyı düzenle" : "Yeni kullanıcı"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ad soyad",
							value: displayName,
							set: setDisplayName,
							max: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kullanıcı adı",
							value: username,
							set: setUsername,
							max: 60
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: selectedId ? "Yeni parola (değişmeyecekse boş)" : "Parola",
							value: password,
							set: setPassword,
							max: 256
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-sm font-medium",
							children: "Rol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: roleId,
							onChange: (e) => setRoleId(e.target.value),
							className: "h-11 w-full border border-border-strong bg-bg-elevated px-3",
							children: access.roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: role.id,
								children: role.name
							}, role.id))
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: active,
								onChange: (e) => setActive(e.target.checked)
							}), "Aktif"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: locked,
								onChange: (e) => setLocked(e.target.checked)
							}), "Kilitli"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: twoFactorRequired,
								onChange: (e) => setTwoFactorRequired(e.target.checked)
							}), "2FA zorunlu"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 flex justify-between",
					children: [selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "text-danger",
						onClick: () => void remove(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Sil"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy || !roleId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), busy ? "Kaydediliyor…" : "Kaydet"]
					})]
				})
			]
		})]
	});
}
function ApprovalsAdmin({ access, refresh }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function review(id, status) {
		setBusy(id);
		try {
			await reviewAdminApproval({ data: {
				id,
				status,
				note: ""
			} });
			await refresh();
			toast.success(status === "approved" ? "İşlem onaylandı." : "İşlem reddedildi.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "İşlem tamamlanamadı.");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "divide-y divide-border border border-border bg-bg-elevated",
		children: access.approvals.length ? access.approvals.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: permissionLabel(item.permission_key)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-fg-muted",
					children: [
						item.requester_name,
						" · ",
						item.resource_type,
						item.resource_id ? ` / ${item.resource_id}` : "",
						" ·",
						" ",
						new Date(item.created_at).toLocaleString("tr-TR")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 inline-block rounded bg-bg-wash px-2 py-1 text-xs",
					children: item.status === "pending" ? "Bekliyor" : item.status === "approved" ? "Onaylandı" : "Reddedildi"
				})
			] }), item.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy === item.id,
					onClick: () => void review(item.id, "rejected"),
					children: "Reddet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy === item.id,
					onClick: () => void review(item.id, "approved"),
					children: "Onayla"
				})]
			})]
		}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-fg-muted",
			children: "Onay talebi yok."
		})
	});
}
function SecurityAdmin({ access, currentSessionId, refresh }) {
	async function revoke(id) {
		if (!confirm("Bu oturum kapatılsın mı?")) return;
		try {
			await revokeAdminSession({ data: { id } });
			await refresh();
			toast.success("Oturum kapatıldı.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Oturum kapatılamadı.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b border-border p-5 font-display text-2xl",
					children: "Aktif oturumlar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: access.sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [session.actor_name, session.id === currentSessionId ? " · Bu oturum" : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-fg-muted",
							children: [
								session.ip,
								" · ",
								session.user_agent,
								" ·",
								" ",
								new Date(session.created_at).toLocaleString("tr-TR")
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: Boolean(session.revoked_at),
							onClick: () => void revoke(session.id),
							children: session.revoked_at ? "Kapatıldı" : "Oturumu kapat"
						})]
					}, session.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b border-border p-5 font-display text-2xl",
					children: "Giriş geçmişi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: access.logins.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid gap-1 p-4 sm:grid-cols-[1fr_auto]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								event.username,
								" · ",
								event.success ? "Başarılı" : "Başarısız"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-fg-muted",
							children: [
								event.ip,
								" · ",
								event.user_agent,
								event.reason ? ` · ${event.reason}` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-fg-muted",
							children: new Date(event.created_at).toLocaleString("tr-TR")
						})]
					}, event.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b border-border p-5 font-display text-2xl",
					children: "Değiştirilemeyen aktivite kayıtları"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: access.activity.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid gap-1 p-4 sm:grid-cols-[1fr_auto]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								event.actor_name,
								" · ",
								permissionLabel(event.permission_key)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-fg-muted",
							children: [
								event.action,
								" · ",
								event.resource_type,
								event.resource_id ? ` / ${event.resource_id}` : "",
								" · ",
								event.ip
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-fg-muted",
							children: new Date(event.created_at).toLocaleString("tr-TR")
						})]
					}, event.id))
				})]
			})
		]
	});
}
function System({ items, orders, scripts, config }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Katalog",
				value: `${items.length} ürün`,
				note: `${items.filter((x) => x.status === "active").length} yayında`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Site kodları",
				value: `${scripts.length} kayıt`,
				note: `${scripts.filter((x) => x.active).length} etkin`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Sipariş verisi",
				value: `${orders.length} kayıt`,
				note: "Sunucu veritabanında"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Site ayarları",
				value: config.updatedAt ? "Yönetiliyor" : "Varsayılan",
				note: config.updatedAt ? new Date(config.updatedAt).toLocaleString("tr-TR") : "Henüz değiştirilmedi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Güvenlik",
				value: "Oturum etkin",
				note: "Sunucu doğrulamalı · 8 saat"
			})
		]
	});
}
function Field({ label, value, set, max }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-2 block text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => set(e.target.value),
			maxLength: max,
			required: true
		})]
	});
}
function Card({ title, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-border bg-bg-elevated p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-3xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-fg-muted",
				children: note
			})
		]
	});
}
function label(a) {
	if (a === "site_config_update") return "Site ayarları güncellendi";
	if (a.startsWith("order_")) return `Sipariş ${orderStatusLabel(a.slice(6)).toLocaleLowerCase("tr-TR")}`;
	if (a.startsWith("script_")) return a === "script_create" ? "Site kodu eklendi" : a === "script_delete" ? "Site kodu silindi" : "Site kodu güncellendi";
	if (a.includes("archive")) return "Ürün arşivlendi";
	if (a.includes("inactive")) return "Ürün pasife alındı";
	if (a.includes("active")) return "Ürün yayınlandı";
	return "Ürün ve SEO güncellendi";
}
//#endregion
export { Admin as component };

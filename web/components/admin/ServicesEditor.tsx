"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  apiGet,
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";
import {
  SERVICE_ICON_NAMES,
  type ServiceIconName,
} from "@/lib/services";

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type Accent = "blue" | "orange";

export type ServiceCategoryRow = {
  id: number;
  slug: string;
  name: string;
  num: string;
  tagline: string;
  description: string;
  image: string | null;
  icon: string;
  accent: string;
  order: number;
  status: Status;
  serviceCount: number;
};

export type ServiceRow = {
  id: number;
  categoryId: number;
  slug: string;
  name: string;
  summary: string;
  icon: string;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  overview: string;
  provides: string[];
  capabilities: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  order: number;
  status: Status;
  category: { id: number; slug: string; name: string };
};

const TABS = [
  { id: "categories", label: "Categories" },
  { id: "services", label: "Services" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function isStatus(value: string): value is Status {
  return value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
}

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: Status;
  onChange: (value: Status) => void;
}) {
  return (
    <select
      id={id}
      className={inputClass}
      value={value}
      onChange={(event) => {
        if (isStatus(event.target.value)) onChange(event.target.value);
      }}
    >
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
      <option value="ARCHIVED">Archived</option>
    </select>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  required = false,
  maxLength,
  type = "text",
  help,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "number" | "url";
  help?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
      />
      {help ? <p className="mt-1 text-xs leading-5 text-white/45">{help}</p> : null}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  required = false,
  maxLength,
  rows = 4,
  help,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  help?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        rows={rows}
      />
      {help ? <p className="mt-1 text-xs leading-5 text-white/45">{help}</p> : null}
    </div>
  );
}

type CategoryForm = Omit<ServiceCategoryRow, "id" | "serviceCount"> & {
  id: number | null;
};

function blankCategory(order: number): CategoryForm {
  return {
    id: null,
    slug: "",
    name: "",
    num: "",
    tagline: "",
    description: "",
    image: null,
    icon: "software",
    accent: "blue",
    order,
    status: "DRAFT",
  };
}

type ServiceForm = Omit<ServiceRow, "id" | "categoryId" | "category"> & {
  id: number | null;
  categorySlug: string;
};

function blankService(categories: ServiceCategoryRow[], order: number): ServiceForm {
  return {
    id: null,
    categorySlug: categories[0]?.slug ?? "",
    slug: "",
    name: "",
    summary: "",
    icon: "software",
    image: null,
    seoTitle: null,
    seoDescription: null,
    overview: "",
    provides: [],
    capabilities: [],
    benefits: [],
    useCases: [],
    technologies: [],
    order,
    status: "DRAFT",
  };
}

function serviceFormFromRow(row: ServiceRow): ServiceForm {
  const { category, categoryId: _categoryId, ...service } = row;
  return { ...service, id: row.id, categorySlug: category.slug };
}

function nextOrder(rows: Array<{ order: number }>): number {
  return rows.reduce((max, row) => Math.max(max, row.order), 0) + 10;
}

function linesToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToLines(value: string[]): string {
  return value.join("\n");
}

function Feedback({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${
        error
          ? "border-red-300/20 bg-red-500/10 text-red-100"
          : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
      }`}
    >
      {text}
    </p>
  );
}

export default function ServicesEditor({
  initialCategories,
  initialServices,
  canSave,
}: {
  initialCategories: ServiceCategoryRow[];
  initialServices: ServiceRow[];
  canSave: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("categories");
  const [categories, setCategories] = useState(initialCategories);
  const [services, setServices] = useState(initialServices);
  const [refreshError, setRefreshError] = useState("");

  const refreshData = useCallback(async () => {
    const [categoryResult, serviceResult] = await Promise.all([
      apiGet<{ categories: ServiceCategoryRow[] }>("/api/admin/services/categories"),
      apiGet<{ services: ServiceRow[] }>("/api/admin/services"),
    ]);
    if (!categoryResult.ok) {
      setRefreshError(categoryResult.error);
      return false;
    }
    if (!serviceResult.ok) {
      setRefreshError(serviceResult.error);
      return false;
    }
    setCategories(categoryResult.data.categories);
    setServices(serviceResult.data.services);
    setRefreshError("");
    return true;
  }, []);

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(TABS[nextIndex].id);
    document.getElementById(`services-tab-${TABS[nextIndex].id}`)?.focus();
  };

  return (
    <div>
      {!canSave ? (
        <p
          role="status"
          className="mb-5 rounded-xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-amber-100"
        >
          Database content is unavailable. The static public catalog is
          unaffected; service changes are disabled.
        </p>
      ) : null}
      {refreshError ? (
        <div className="mb-5">
          <Feedback text={`Saved, but the refreshed list could not be loaded: ${refreshError}`} error />
        </div>
      ) : null}

      <div
        role="tablist"
        aria-label="Services CMS sections"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
      >
        {TABS.map((tab, index) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`services-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`services-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${
                active
                  ? "bg-brand-orange text-ink"
                  : "border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="services-panel-categories"
        role="tabpanel"
        aria-labelledby="services-tab-categories"
        tabIndex={0}
        hidden={activeTab !== "categories"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <CategoriesPanel
          categories={categories}
          canSave={canSave}
          onChanged={refreshData}
        />
      </div>
      <div
        id="services-panel-services"
        role="tabpanel"
        aria-labelledby="services-tab-services"
        tabIndex={0}
        hidden={activeTab !== "services"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <ServicesPanel
          categories={categories}
          services={services}
          canSave={canSave}
          onChanged={refreshData}
        />
      </div>
    </div>
  );
}

function CategoriesPanel({
  categories,
  canSave,
  onChanged,
}: {
  categories: ServiceCategoryRow[];
  canSave: boolean;
  onChanged: () => Promise<boolean>;
}) {
  const [form, setForm] = useState<CategoryForm>(() =>
    blankCategory(nextOrder(categories)),
  );
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setField = <K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const edit = (category: ServiceCategoryRow) => {
    setForm({
      id: category.id,
      slug: category.slug,
      name: category.name,
      num: category.num,
      tagline: category.tagline,
      description: category.description,
      image: category.image,
      icon: category.icon,
      accent: category.accent,
      order: category.order,
      status: category.status,
    });
    setDirty(false);
    setFeedback("");
  };

  const startNew = () => {
    setForm(blankCategory(nextOrder(categories)));
    setDirty(false);
    setFeedback("");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    const { id, ...payload } = form;
    const result = await apiSend<{ category: ServiceCategoryRow }>(
      id === null
        ? "/api/admin/services/categories"
        : `/api/admin/services/categories/${id}`,
      id === null ? "POST" : "PUT",
      payload,
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(id === null ? "Category created." : "Category saved.");
    setFeedbackError(false);
    setDirty(false);
    if (id === null) startNew();
    await onChanged();
  };

  const remove = async (category: ServiceCategoryRow) => {
    if (category.serviceCount > 0) return;
    if (!window.confirm(`Delete the empty category “${category.name}”?`)) return;
    setBusy(true);
    setFeedback("");
    const result = await apiSend(
      `/api/admin/services/categories/${category.id}`,
      "DELETE",
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    if (form.id === category.id) startNew();
    setFeedback("Category deleted.");
    setFeedbackError(false);
    await onChanged();
  };

  const updateText =
    (key: "slug" | "name" | "num" | "tagline" | "description" | "image") =>
    (value: string) =>
      setField(key, key === "image" ? (value || null) : value);

  return (
    <section aria-labelledby="service-categories-title" className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="service-categories-title" className="text-lg font-bold text-white">
            Service categories
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
            Edit the category presentation, icon, image, publication status and
            order. Categories with services cannot be deleted.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          disabled={busy || !canSave}
          className={secondaryButton}
        >
          New category
        </button>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
              <tr>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Services</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Order</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {categories.map((category) => (
                <tr key={category.id} className="text-white/80">
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-white">{category.name}</span>
                    <span className="text-xs text-white/45">/{category.slug}</span>
                  </td>
                  <td className="px-4 py-3">{category.serviceCount}</td>
                  <td className="px-4 py-3">{category.status}</td>
                  <td className="px-4 py-3">{category.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => edit(category)}
                        disabled={busy || !canSave}
                        className={secondaryButton}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(category)}
                        disabled={busy || !canSave || category.serviceCount > 0}
                        title={
                          category.serviceCount > 0
                            ? "Move or delete its services first."
                            : "Delete this empty category."
                        }
                        className={`${secondaryButton} text-red-100`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/55">
                    No categories are stored in the CMS yet. Existing static
                    public content remains available and is not imported.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <form onSubmit={save} className="space-y-4 rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-semibold text-white">
            {form.id === null ? "Create category" : "Edit category"}
          </h3>
          {feedback ? <Feedback text={feedback} error={feedbackError} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput id="category-name" label="Name" value={form.name} onChange={updateText("name")} required maxLength={120} />
            <TextInput id="category-slug" label="Slug" value={form.slug} onChange={updateText("slug")} required maxLength={100} help="Lowercase letters, numbers and dashes; this controls the category URL." />
            <TextInput id="category-number" label="Display number" value={form.num} onChange={updateText("num")} maxLength={20} />
            <TextInput id="category-tagline" label="Tagline" value={form.tagline} onChange={updateText("tagline")} maxLength={200} />
            <TextInput id="category-image" label="Image path or HTTPS URL" value={form.image ?? ""} onChange={updateText("image")} maxLength={2048} />
            <TextInput id="category-order" label="Display order" type="number" value={String(form.order)} onChange={(value) => setField("order", Number(value))} required />
            <div>
              <label className={labelClass} htmlFor="category-icon">Icon</label>
              <select id="category-icon" className={inputClass} value={form.icon} onChange={(event) => setField("icon", event.target.value)}>
                {SERVICE_ICON_NAMES.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="category-accent">Accent</label>
              <select id="category-accent" className={inputClass} value={form.accent} onChange={(event) => setField("accent", event.target.value as Accent)}>
                <option value="blue">Blue</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="category-status">Publishing status</label>
              <StatusSelect id="category-status" value={form.status} onChange={(value) => setField("status", value)} />
            </div>
          </div>
          <TextArea id="category-description" label="Description" value={form.description} onChange={updateText("description")} required maxLength={2000} rows={4} />
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={busy || !canSave} className={primaryButton}>
              {busy ? "Saving…" : "Save category"}
            </button>
            <button type="button" onClick={startNew} disabled={busy} className={secondaryButton}>
              Clear form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ServicesPanel({
  categories,
  services,
  canSave,
  onChanged,
}: {
  categories: ServiceCategoryRow[];
  services: ServiceRow[];
  canSave: boolean;
  onChanged: () => Promise<boolean>;
}) {
  const [form, setForm] = useState<ServiceForm>(() =>
    blankService(categories, nextOrder(services)),
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setField = <K extends keyof ServiceForm>(
    key: K,
    value: ServiceForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const edit = (service: ServiceRow) => {
    setForm(serviceFormFromRow(service));
    setDirty(false);
    setFeedback("");
  };

  const startNew = () => {
    setForm(blankService(categories, nextOrder(services)));
    setDirty(false);
    setFeedback("");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    const { id, categorySlug, ...fields } = form;
    const payload = {
      ...fields,
      categorySlug,
      image: form.image ?? "",
      seoTitle: form.seoTitle ?? "",
      seoDescription: form.seoDescription ?? "",
    };
    const result = await apiSend<{ service: ServiceRow }>(
      id === null ? "/api/admin/services" : `/api/admin/services/${id}`,
      id === null ? "POST" : "PUT",
      payload,
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(id === null ? "Service created." : "Service saved.");
    setFeedbackError(false);
    setDirty(false);
    if (id === null) startNew();
    await onChanged();
  };

  const remove = async (service: ServiceRow) => {
    if (!window.confirm(`Delete “${service.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/services/${service.id}`, "DELETE");
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    if (form.id === service.id) startNew();
    setFeedback("Service deleted.");
    setFeedbackError(false);
    await onChanged();
  };

  const filteredServices = services.filter((service) => {
    const term = search.trim().toLowerCase();
    const matchesText =
      !term ||
      service.name.toLowerCase().includes(term) ||
      service.slug.toLowerCase().includes(term) ||
      service.summary.toLowerCase().includes(term);
    const matchesCategory =
      categoryFilter === "all" || String(service.categoryId) === categoryFilter;
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    return matchesText && matchesCategory && matchesStatus;
  });

  const updateText =
    (
      key:
        | "slug"
        | "name"
        | "summary"
        | "icon"
        | "image"
        | "seoTitle"
        | "seoDescription"
        | "overview",
    ) =>
    (value: string) =>
      setField(
        key,
        key === "image" || key === "seoTitle" || key === "seoDescription"
          ? (value || null)
          : value,
      );
  const updateList =
    (
      key:
        | "provides"
        | "capabilities"
        | "benefits"
        | "useCases"
        | "technologies",
    ) =>
    (value: string) =>
      setField(key, linesToList(value));

  return (
    <section aria-labelledby="services-list-title" className={panelClass}>
      <div>
        <h2 id="services-list-title" className="text-lg font-bold text-white">
          Individual services
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
          Search and filter the catalog, edit all existing service content,
          and manage publishing status and display order.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="service-search">Search</label>
          <input id="service-search" className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, slug or description" />
        </div>
        <div>
          <label className={labelClass} htmlFor="service-filter-category">Category</label>
          <select id="service-filter-category" className={inputClass} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="service-filter-status">Status</label>
          <select id="service-filter-status" className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
            <tr>
              <th scope="col" className="px-4 py-3">Service</th>
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Order</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredServices.map((service) => (
              <tr key={service.id} className="text-white/80">
                <td className="px-4 py-3">
                  <span className="block font-semibold text-white">{service.name}</span>
                  <span className="text-xs text-white/45">{service.slug}</span>
                </td>
                <td className="px-4 py-3">{service.category.name}</td>
                <td className="px-4 py-3">{service.status}</td>
                <td className="px-4 py-3">{service.order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => edit(service)} disabled={busy || !canSave} className={secondaryButton}>Edit</button>
                    <button type="button" onClick={() => void remove(service)} disabled={busy || !canSave} className={`${secondaryButton} text-red-100`}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/55">
                  No services match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <form onSubmit={save} className="mt-6 space-y-5 rounded-xl border border-white/10 bg-black/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">
              {form.id === null ? "Create service" : "Edit service"}
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Published entries require both a short and full description.
            </p>
          </div>
          <button type="button" onClick={startNew} disabled={busy} className={secondaryButton}>New service</button>
        </div>
        {feedback ? <Feedback text={feedback} error={feedbackError} /> : null}
        {categories.length === 0 ? (
          <p role="status" className="rounded-lg border border-amber-300/20 bg-amber-500/5 p-3 text-sm text-amber-100">
            Create a category before adding services.
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TextInput id="service-name" label="Service title" value={form.name} onChange={updateText("name")} required maxLength={120} />
          <TextInput id="service-slug" label="Slug" value={form.slug} onChange={updateText("slug")} required maxLength={120} help="Changing this changes the public URL." />
          <div>
            <label className={labelClass} htmlFor="service-category">Category</label>
            <select id="service-category" className={inputClass} value={form.categorySlug} onChange={(event) => setField("categorySlug", event.target.value)} required disabled={categories.length === 0}>
              <option value="" disabled>Select a category</option>
              {categories.map((category) => <option key={category.id} value={category.slug}>{category.name} ({category.status.toLowerCase()})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="service-icon">Icon</label>
            <select id="service-icon" className={inputClass} value={form.icon} onChange={(event) => setField("icon", event.target.value as ServiceIconName)}>
              {SERVICE_ICON_NAMES.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <TextInput id="service-image" label="Featured image path or HTTPS URL" value={form.image ?? ""} onChange={updateText("image")} maxLength={2048} />
          <TextInput id="service-order" label="Display order" type="number" value={String(form.order)} onChange={(value) => setField("order", Number(value))} required />
          <div>
            <label className={labelClass} htmlFor="service-status">Publishing status</label>
            <StatusSelect id="service-status" value={form.status} onChange={(value) => setField("status", value)} />
          </div>
        </div>

        <TextArea id="service-summary" label="Short description" value={form.summary} onChange={updateText("summary")} required={form.status === "PUBLISHED"} maxLength={600} rows={3} />
        <TextArea id="service-overview" label="Full description" value={form.overview} onChange={updateText("overview")} required={form.status === "PUBLISHED"} maxLength={8000} rows={5} />

        <div className="grid gap-4 md:grid-cols-2">
          <TextArea id="service-provides" label="What the service provides" value={listToLines(form.provides)} onChange={updateList("provides")} rows={5} help="One item per line." />
          <TextArea id="service-features" label="Features / capabilities" value={listToLines(form.capabilities)} onChange={updateList("capabilities")} rows={5} help="One item per line." />
          <TextArea id="service-benefits" label="Benefits" value={listToLines(form.benefits)} onChange={updateList("benefits")} rows={5} help="One item per line." />
          <TextArea id="service-use-cases" label="Use cases" value={listToLines(form.useCases)} onChange={updateList("useCases")} rows={5} help="One item per line." />
          <TextArea id="service-technologies" label="Technologies and platforms" value={listToLines(form.technologies)} onChange={updateList("technologies")} rows={5} help="One item per line." />
          <div className="space-y-4">
            <TextInput id="service-seo-title" label="SEO title" value={form.seoTitle ?? ""} onChange={updateText("seoTitle")} maxLength={150} />
            <TextArea id="service-seo-description" label="SEO description" value={form.seoDescription ?? ""} onChange={updateText("seoDescription")} maxLength={300} rows={4} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy || !canSave || categories.length === 0} className={primaryButton}>
            {busy ? "Saving…" : "Save service"}
          </button>
          <button type="button" onClick={startNew} disabled={busy} className={secondaryButton}>Clear form</button>
        </div>
      </form>
    </section>
  );
}

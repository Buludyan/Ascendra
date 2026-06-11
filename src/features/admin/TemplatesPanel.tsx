import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Edit3, Plus, X } from 'lucide-react'

import { useTemplates } from '../../api/queries'
import type { VMTemplate } from '../../domain/types'
import { TemplateEditor } from './TemplateEditor'

export function TemplatesPanel() {
  const templatesQuery = useTemplates()
  const templates = templatesQuery.data ?? []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<VMTemplate | null>(null)

  function openCreateDialog() {
    setEditingTemplate(null)
    setDialogOpen(true)
  }

  function openEditDialog(template: VMTemplate) {
    setEditingTemplate(template)
    setDialogOpen(true)
  }

  return (
    <section className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Templates</h3>
          <p className="mt-1 text-sm text-slate-500">
            Approved machine shapes developers can launch.
          </p>
        </div>
        <button
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          New template
        </button>
      </div>

      {templatesQuery.isLoading ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="h-48 animate-pulse rounded-2xl bg-slate-100"
              key={item}
            />
          ))}
        </div>
      ) : null}

      {templatesQuery.isError ? (
        <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          Failed to load templates.
        </div>
      ) : null}

      {!templatesQuery.isLoading && !templatesQuery.isError && templates.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <h4 className="font-semibold text-slate-950">No templates yet</h4>
          <p className="mt-1 text-sm text-slate-500">
            Create the first approved developer machine template.
          </p>
        </div>
      ) : null}

      {templates.length > 0 ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <article
              className="rounded-2xl border border-slate-900/10 bg-white p-4"
              key={template.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-950">
                    {template.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {template.baseImage}
                  </p>
                </div>
                <button
                  aria-label={`Edit ${template.name}`}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  onClick={() => openEditDialog(template)}
                  type="button"
                >
                  <Edit3 aria-hidden="true" size={15} />
                </button>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                {template.description}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <Spec label="CPU" value={String(template.vCpu)} />
                <Spec label="RAM" value={`${template.memoryGb}GB`} />
                <Spec label="Disk" value={`${template.diskSizeGb}GB`} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.preinstalledTools.slice(0, 3).map((tool) => (
                  <span
                    className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800"
                    key={tool}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog.Root onOpenChange={setDialogOpen} open={dialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl shadow-slate-950/25 focus:outline-none">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {editingTemplate ? 'Edit template' : 'Create template'}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  Define the machine spec and base image available to engineers.
                </Dialog.Description>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                <X aria-hidden="true" size={17} />
              </Dialog.Close>
            </div>
            <TemplateEditor
              key={editingTemplate?.id ?? 'create'}
              onSaved={() => setDialogOpen(false)}
              template={editingTemplate}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-2 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-slate-950">{value}</dd>
    </div>
  )
}

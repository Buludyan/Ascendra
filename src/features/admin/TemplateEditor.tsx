import { useState } from 'react'

import { useCreateTemplate, useUpdateTemplate } from '../../api/queries'
import type { TemplateDraft, VMTemplate } from '../../domain/types'

interface TemplateEditorProps {
  onSaved: () => void
  template?: VMTemplate | null
}

const emptyTemplate: TemplateDraft = {
  baseImage: 'ubuntu-24.04',
  description: '',
  diskSizeGb: 120,
  memoryGb: 16,
  name: '',
  preinstalledTools: ['vscode-server', 'docker'],
  vCpu: 4,
}

export function TemplateEditor({ onSaved, template }: TemplateEditorProps) {
  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()
  const initialValue = template ?? emptyTemplate
  const [name, setName] = useState(initialValue.name)
  const [description, setDescription] = useState(initialValue.description)
  const [baseImage, setBaseImage] = useState(initialValue.baseImage)
  const [vCpu, setVCpu] = useState(String(initialValue.vCpu))
  const [memoryGb, setMemoryGb] = useState(String(initialValue.memoryGb))
  const [diskSizeGb, setDiskSizeGb] = useState(String(initialValue.diskSizeGb))
  const [preinstalledTools, setPreinstalledTools] = useState(
    initialValue.preinstalledTools.join(', '),
  )
  const isSaving = createTemplate.isPending || updateTemplate.isPending
  const error = createTemplate.error ?? updateTemplate.error

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const draft: TemplateDraft = {
      baseImage,
      description,
      diskSizeGb: Number(diskSizeGb),
      memoryGb: Number(memoryGb),
      name,
      preinstalledTools: preinstalledTools
        .split(',')
        .map((tool) => tool.trim())
        .filter(Boolean),
      vCpu: Number(vCpu),
    }

    if (template) {
      updateTemplate.mutate(
        {
          template: draft,
          templateId: template.id,
        },
        {
          onSuccess: onSaved,
        },
      )
      return
    }

    createTemplate.mutate(draft, {
      onSuccess: onSaved,
    })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Name">
        <input
          className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </Field>
      <Field label="Description">
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-900/10 px-3 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          onChange={(event) => setDescription(event.target.value)}
          required
          value={description}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Base image">
          <input
            className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            onChange={(event) => setBaseImage(event.target.value)}
            required
            value={baseImage}
          />
        </Field>
        <Field label="vCPU">
          <input
            className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            min={1}
            onChange={(event) => setVCpu(event.target.value)}
            required
            type="number"
            value={vCpu}
          />
        </Field>
        <Field label="Memory GB">
          <input
            className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            min={1}
            onChange={(event) => setMemoryGb(event.target.value)}
            required
            type="number"
            value={memoryGb}
          />
        </Field>
        <Field label="Disk GB">
          <input
            className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            min={1}
            onChange={(event) => setDiskSizeGb(event.target.value)}
            required
            type="number"
            value={diskSizeGb}
          />
        </Field>
      </div>
      <Field label="Preinstalled tools">
        <input
          className="h-11 w-full rounded-2xl border border-slate-900/10 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          onChange={(event) => setPreinstalledTools(event.target.value)}
          placeholder="vscode-server, docker, node"
          value={preinstalledTools}
        />
      </Field>

      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error.message}
        </div>
      ) : null}

      <button
        className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? 'Saving...' : template ? 'Save template' : 'Create template'}
      </button>
    </form>
  )
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

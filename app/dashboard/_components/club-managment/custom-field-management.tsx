"use client"

import {useState} from "react"
import {Plus, Edit3, Trash2, GripVertical} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Badge} from "@/components/ui/badge"
import {Switch} from "@/components/ui/switch"

interface CustomField {
    id: number
    name: string
    type: "text" | "number" | "date" | "select" | "boolean"
    required: boolean
    options?: string[]
    defaultValue?: string
    description?: string
    order: number
}

// Mock custom fields data
const mockCustomFields: CustomField[] = [
    {
        id: 1,
        name: "Emergency Contact",
        type: "text",
        required: true,
        description: "Emergency contact person and phone number",
        order: 1,
    },
    {
        id: 2,
        name: "Running Experience",
        type: "select",
        required: false,
        options: ["Beginner", "Intermediate", "Advanced", "Elite"],
        description: "Years of running experience",
        order: 2,
    },
    {
        id: 3,
        name: "Personal Best 5K",
        type: "text",
        required: false,
        description: "Personal best 5K time (MM:SS format)",
        order: 3,
    },
    {
        id: 4,
        name: "Medical Conditions",
        type: "text",
        required: false,
        description: "Any medical conditions or allergies",
        order: 4,
    },
    {
        id: 5,
        name: "Preferred Training Days",
        type: "select",
        required: false,
        options: ["Weekdays", "Weekends", "Both", "Flexible"],
        description: "Preferred days for training sessions",
        order: 5,
    },
]

interface CustomFieldManagementProps {
    clubId: string
}

export function CustomFieldManagement({clubId}: CustomFieldManagementProps) {
    const [fields, setFields] = useState(mockCustomFields)
    const [isAddingField, setIsAddingField] = useState(false)
    const [editingField, setEditingField] = useState<CustomField | null>(null)

    const handleAddField = (newField: Omit<CustomField, "id" | "order">) => {
        const field: CustomField = {
            ...newField,
            id: Date.now(),
            order: fields.length + 1,
        }
        setFields((prev) => [...prev, field])
        setIsAddingField(false)
    }

    const handleEditField = (updatedField: CustomField) => {
        setFields((prev) => prev.map((f) => (f.id === updatedField.id ? updatedField : f)))
        setEditingField(null)
    }

    const handleDeleteField = (id: number) => {
        setFields((prev) => prev.filter((f) => f.id !== id))
    }

    const moveField = (id: number, direction: "up" | "down") => {
        const currentIndex = fields.findIndex((f) => f.id === id)
        if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === fields.length - 1)) {
            return
        }

        const newFields = [...fields]
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

        // Swap the fields
        if (targetIndex >= 0 && targetIndex < newFields.length) {
            ;[newFields[currentIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[currentIndex]]
        }

        // Update order values
        newFields.forEach((field, index) => {
            field.order = index + 1
        })

        setFields(newFields)
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "text":
                return "bg-blue-500/20 text-blue-500"
            case "number":
                return "bg-green-500/20 text-green-500"
            case "date":
                return "bg-purple-500/20 text-purple-500"
            case "select":
                return "bg-orange-500/20 text-orange-500"
            case "boolean":
                return "bg-pink-500/20 text-pink-500"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Custom Field Management</CardTitle>
                        <CardDescription className="text-white/60">
                            Create and manage custom fields for member profiles and data tracking
                        </CardDescription>
                    </div>
                    <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4"/>
                                Add Field
                            </Button>
                        </DialogTrigger>
                        <FieldDialog onSave={handleAddField} onCancel={() => setIsAddingField(false)}/>
                    </Dialog>
                </CardHeader>
            </Card>

            {/* Fields List */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Current Custom Fields</CardTitle>
                    <CardDescription className="text-white/60">Drag to reorder fields or click to edit</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {fields
                            .sort((a, b) => a.order - b.order)
                            .map((field, index) => (
                                <Card key={field.id}
                                      className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => moveField(field.id, "up")}
                                                        disabled={index === 0}
                                                    >
                                                        <GripVertical className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => moveField(field.id, "down")}
                                                        disabled={index === fields.length - 1}
                                                    >
                                                        <GripVertical className="h-4 w-4"/>
                                                    </Button>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium">{field.name}</h4>
                                                        <Badge variant="outline"
                                                               className={`border-0 ${getTypeColor(field.type)}`}>
                                                            {field.type}
                                                        </Badge>
                                                        {field.required && (
                                                            <Badge variant="outline"
                                                                   className="bg-red-500/20 text-red-500 border-0 text-xs">
                                                                Required
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {field.description &&
                                                        <p className="text-sm text-white/60">{field.description}</p>}
                                                    {field.options && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {field.options.map((option, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    variant="outline"
                                                                    className="bg-white/5 text-white/60 border-white/10 text-xs"
                                                                >
                                                                    {option}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"
                                                        onClick={() => setEditingField(field)}>
                                                    <Edit3 className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-300"
                                                    onClick={() => handleDeleteField(field.id)}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                        {fields.length === 0 && (
                            <div className="text-center py-12 text-white/60">
                                <p>No custom fields created yet.</p>
                                <p className="text-sm mt-1">Add your first custom field to get started.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Field Dialog */}
            {editingField && (
                <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
                    <FieldDialog field={editingField} onSave={handleEditField} onCancel={() => setEditingField(null)}/>
                </Dialog>
            )}
        </div>
    )
}

function FieldDialog({
                         field,
                         onSave,
                         onCancel,
                     }: {
    field?: CustomField
    onSave: (field: any) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        name: field?.name || "",
        type: field?.type || "text",
        required: field?.required || false,
        description: field?.description || "",
        options: field?.options?.join(", ") || "",
        defaultValue: field?.defaultValue || "",
    })

    const handleSubmit = () => {
        const fieldData = {
            ...field,
            ...formData,
            options:
                formData.type === "select"
                    ? formData.options
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : undefined,
        }
        onSave(fieldData)
    }

    return (
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
            <DialogHeader>
                <DialogTitle>{field ? "Edit Custom Field" : "Add Custom Field"}</DialogTitle>
                <DialogDescription className="text-white/60">Configure a custom field for member
                    profiles</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Field Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
                        placeholder="e.g., Emergency Contact"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Field Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({...prev, type: value as any}))}
                    >
                        <SelectTrigger className="bg-zinc-800/50 border-white/10">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select (Dropdown)</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({...prev, description: e.target.value}))}
                        placeholder="Brief description of this field"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>

                {formData.type === "select" && (
                    <div className="space-y-2">
                        <Label htmlFor="options">Options (comma-separated)</Label>
                        <Input
                            id="options"
                            value={formData.options}
                            onChange={(e) => setFormData((prev) => ({...prev, options: e.target.value}))}
                            placeholder="Option 1, Option 2, Option 3"
                            className="bg-zinc-800/50 border-white/10"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="defaultValue">Default Value (Optional)</Label>
                    <Input
                        id="defaultValue"
                        value={formData.defaultValue}
                        onChange={(e) => setFormData((prev) => ({...prev, defaultValue: e.target.value}))}
                        placeholder="Default value for this field"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="required"
                        checked={formData.required}
                        onCheckedChange={(checked) => setFormData((prev) => ({...prev, required: checked}))}
                    />
                    <Label htmlFor="required">Required field</Label>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} className="border-white/10 hover:bg-white/5">
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>{field ? "Save Changes" : "Add Field"}</Button>
            </DialogFooter>
        </DialogContent>
    )
}

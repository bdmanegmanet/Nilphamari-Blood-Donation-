import React, { useState } from 'react';
import { 
  CustomFormConfig, 
  CustomFormField, 
  ApplicationSectionConfig 
} from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  MoveUp, 
  MoveDown,
  Layers,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { NILPHAMARI_UPAZILAS, INITIAL_CUSTOM_FORMS } from '../../data/initialData';

interface CustomFormsManagerProps {
  appConfig: ApplicationSectionConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<ApplicationSectionConfig>>;
}

export const CustomFormsManager: React.FC<CustomFormsManagerProps> = ({
  appConfig,
  setAppConfig
}) => {
  const forms = (appConfig.customForms && appConfig.customForms.length > 0)
    ? appConfig.customForms
    : INITIAL_CUSTOM_FORMS;

  const [selectedFormId, setSelectedFormId] = useState<string>(forms[0]?.id || 'volunteer');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // Modal / Form state for adding new Question/Field
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldData, setNewFieldData] = useState<Partial<CustomFormField>>({
    label: '',
    type: 'text',
    required: true,
    placeholder: '',
    helperText: '',
    options: []
  });
  const [rawOptions, setRawOptions] = useState('');

  // Modal state for creating a completely New Custom Form
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [newFormData, setNewFormData] = useState<Partial<CustomFormConfig>>({
    title: '',
    subtitle: '',
    badge: 'আবেদন',
    instructions: '',
    iconName: 'FileText'
  });

  const selectedForm = forms.find(f => f.id === selectedFormId) || forms[0];

  // Helper to update a form
  const updateForm = (formId: string, updater: (form: CustomFormConfig) => CustomFormConfig) => {
    const updated = forms.map(f => {
      if (f.id === formId) {
        return updater(f);
      }
      return f;
    });
    setAppConfig(prev => ({
      ...prev,
      customForms: updated
    }));
  };

  // Add field to current form
  const handleSaveNewField = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newFieldData.label?.trim()) return;

    const fieldId = 'field_' + Date.now();
    const optionsArray = rawOptions
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const completeField: CustomFormField = {
      id: fieldId,
      label: newFieldData.label.trim(),
      type: newFieldData.type || 'text',
      required: !!newFieldData.required,
      placeholder: newFieldData.placeholder || '',
      helperText: newFieldData.helperText || '',
      options: (newFieldData.type === 'select' || newFieldData.type === 'radio') ? optionsArray : undefined
    };

    updateForm(selectedForm.id, form => ({
      ...form,
      fields: [...form.fields, completeField]
    }));

    setShowAddField(false);
    setNewFieldData({
      label: '',
      type: 'text',
      required: true,
      placeholder: '',
      helperText: '',
      options: []
    });
    setRawOptions('');
  };

  // Delete field
  const handleDeleteField = (fieldId: string) => {
    if (selectedForm.fields.length <= 1) {
      alert('একটি ফরমে অন্তত ১টি প্রশ্ন থাকা প্রয়োজন।');
      return;
    }
    if (window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্ন/ফিল্ডটি মুছে ফেলতে চান?')) {
      updateForm(selectedForm.id, form => ({
        ...form,
        fields: form.fields.filter(f => f.id !== fieldId)
      }));
    }
  };

  // Move field up/down
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedForm.fields.length) return;

    updateForm(selectedForm.id, form => {
      const copy = [...form.fields];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return { ...form, fields: copy };
    });
  };

  // Create a brand new form
  const handleCreateNewForm = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newFormData.title?.trim()) return;

    const newId = 'form_' + Date.now();
    const created: CustomFormConfig = {
      id: newId,
      title: newFormData.title.trim(),
      subtitle: newFormData.subtitle || 'সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন',
      badge: newFormData.badge || 'নতুন আবেদন',
      instructions: newFormData.instructions || 'সঠিক তথ্য দিয়ে ফরম পূরণ করুন।',
      iconName: newFormData.iconName || 'FileText',
      isActive: true,
      fields: [
        { id: 'applicantName', label: 'আবেদনকারীর পুরো নাম', type: 'text', required: true, placeholder: 'নাম লিখুন' },
        { id: 'phone', label: 'সচল মোবাইল নম্বর', type: 'tel', required: true, placeholder: '+880 17XXXXXXXX' },
        { id: 'upazila', label: 'উপজেলা', type: 'select', required: true, options: NILPHAMARI_UPAZILAS },
        { id: 'details', label: 'আবেদনের বিস্তারিত বিষয়', type: 'textarea', required: true, placeholder: 'বিস্তারিত লিখুন...' }
      ]
    };

    setAppConfig(prev => ({
      ...prev,
      customForms: [...forms, created]
    }));

    setSelectedFormId(newId);
    setShowAddFormModal(false);
    setNewFormData({
      title: '',
      subtitle: '',
      badge: 'আবেদন',
      instructions: '',
      iconName: 'FileText'
    });
  };

  // Delete Form
  const handleDeleteForm = (formId: string) => {
    if (forms.length <= 1) {
      alert('কমপক্ষে একটি আবেদন ফরম সিস্টেমে থাকা আবশ্যক।');
      return;
    }
    if (window.confirm('আপনি কি এই আবেদন ফরমটি সম্পূর্ণ মুছে ফেলতে চান?')) {
      const remaining = forms.filter(f => f.id !== formId);
      setAppConfig(prev => ({
        ...prev,
        customForms: remaining
      }));
      setSelectedFormId(remaining[0].id);
    }
  };

  return (
    <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-red-100 text-[#B71C1C] rounded-lg">
              <Settings2 className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-base text-stone-900">
              আবেদন ফরম ও প্রশ্নসমূহ কাস্টমাইজেশন (Dynamic Form Builder)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            যেকোনো আবেদন ফরম নির্বাচন করে নতুন প্রশ্ন যোগ করুন, অপ্রয়োজনীয় প্রশ্ন মুছে ফেলুন অথবা নতুন ফরম তৈরি করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddFormModal(true)}
          className="px-4 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ফরম তৈরি করুন</span>
        </button>
      </div>

      {/* Forms Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {forms.map((f) => {
          const isSelected = selectedForm.id === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setSelectedFormId(f.id);
                setShowAddField(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-white border-[#B71C1C] text-[#B71C1C] shadow-2xs ring-1 ring-[#B71C1C]'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{f.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-red-100 text-red-800' : 'bg-stone-200 text-stone-600'}`}>
                {f.fields.length} প্রশ্ন
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Form Details Editor */}
      {selectedForm && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-6">
          {/* Header Info of Selected Form */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B71C1C] bg-red-50 px-2 py-0.5 rounded-md">
                  {selectedForm.badge || 'আবেদন ফরম'}
                </span>
                <h4 className="text-base font-extrabold text-stone-900 mt-1">
                  {selectedForm.title} - প্রশ্ন তালিকা
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddField(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন প্রশ্ন যোগ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteForm(selectedForm.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="এই ফরমটি ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Basic Info Meta Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">ফরমে প্রদর্শিত শিরোনাম (Title):</label>
                <input
                  type="text"
                  value={selectedForm.title}
                  onChange={(e) => updateForm(selectedForm.id, f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">সাবটাইটেল / সংক্ষিপ্ত বিবরণ:</label>
                <input
                  type="text"
                  value={selectedForm.subtitle || ''}
                  onChange={(e) => updateForm(selectedForm.id, f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">নির্দেশিকা বার্তা (Instructions):</label>
                <input
                  type="text"
                  value={selectedForm.instructions || ''}
                  onChange={(e) => updateForm(selectedForm.id, f => ({ ...f, instructions: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Form Questions/Fields List */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold text-stone-800 flex items-center justify-between">
              <span>ফরমে বিদ্যমান প্রশ্নসমূহ ({selectedForm.fields.length} টি)</span>
              <span className="text-[11px] text-stone-500 font-normal">আবেদনের সময় ইউজাররা এই ফিল্ডগুলো পূরণ করবে</span>
            </h5>

            <div className="space-y-2.5">
              {selectedForm.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900">{field.label}</span>
                        {field.required ? (
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded-sm">বাধ্যতামূলক</span>
                        ) : (
                          <span className="text-[10px] text-stone-500 bg-stone-200 px-1.5 py-0.2 rounded-sm">ঐচ্ছিক</span>
                        )}
                        <span className="text-[10px] text-stone-600 bg-stone-200 px-1.5 py-0.2 rounded-sm font-mono">
                          টাইপ: {field.type}
                        </span>
                      </div>
                      {field.placeholder && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          হিন্ট / প্লেসহোল্ডার: "{field.placeholder}"
                        </p>
                      )}
                      {field.options && field.options.length > 0 && (
                        <p className="text-[10px] text-stone-600 mt-0.5">
                          অপশনসমূহ: {field.options.slice(0, 4).join(', ')}{field.options.length > 4 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
                    {/* Reorder buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveField(idx, 'up')}
                      className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-200"
                      title="উপরে নিন"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedForm.fields.length - 1}
                      onClick={() => handleMoveField(idx, 'down')}
                      className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-200"
                      title="নিচে নিন"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Toggle Required */}
                    <button
                      type="button"
                      onClick={() => {
                        updateForm(selectedForm.id, f => ({
                          ...f,
                          fields: f.fields.map(fl => fl.id === field.id ? { ...fl, required: !fl.required } : fl)
                        }));
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer ${
                        field.required ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-white text-stone-600 border-stone-300'
                      }`}
                      title="বাধ্যতামূলক বা ঐচ্ছিক পরিবর্তন করুন"
                    >
                      {field.required ? 'বাধ্যতামূলক' : 'ঐচ্ছিক'}
                    </button>

                    {/* Delete Question */}
                    <button
                      type="button"
                      onClick={() => handleDeleteField(field.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                      title="প্রশ্নটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Question / Field to Selected Form */}
      {showAddField && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-stone-900">
                নতুন প্রশ্ন বা ফিল্ড তৈরি করুন
              </h3>
              <button
                type="button"
                onClick={() => setShowAddField(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  প্রশ্নের শিরোনাম বা লেবেল *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আপনার পেশা / রক্তের গ্রুপ / ফেসবুক প্রোফাইল"
                  value={newFieldData.label || ''}
                  onChange={(e) => setNewFieldData({ ...newFieldData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ইনপুট ধরন (Field Type)
                  </label>
                  <select
                    value={newFieldData.type || 'text'}
                    onChange={(e) => setNewFieldData({ ...newFieldData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  >
                    <option value="text">এক লাইনের টেক্সট (Text)</option>
                    <option value="textarea">বড় বিবরণ (Textarea)</option>
                    <option value="tel">মোবাইল নম্বর (Phone / Tel)</option>
                    <option value="email">ইমেইল (Email)</option>
                    <option value="number">সংখ্যা (Number)</option>
                    <option value="date">তারিখ (Date)</option>
                    <option value="select">ড্রপডাউন তালিকা (Select)</option>
                    <option value="radio">রেডিও অপশন (Radio Choice)</option>
                    <option value="checkbox">চেকবক্স সম্মতি (Checkbox)</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center space-x-2 text-xs font-bold text-stone-700 cursor-pointer p-2.5 bg-stone-50 rounded-xl border border-stone-300 w-full">
                    <input
                      type="checkbox"
                      checked={!!newFieldData.required}
                      onChange={(e) => setNewFieldData({ ...newFieldData, required: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded-sm"
                    />
                    <span>বাধ্যতামূলক (Required)</span>
                  </label>
                </div>
              </div>

              {(newFieldData.type === 'select' || newFieldData.type === 'radio') && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    অপশন তালিকা (প্রতি লাইনে একটি করে অপশন লিখুন) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="অপশন ১&#10;অপশন ২&#10;অপশন ৩"
                    value={rawOptions}
                    onChange={(e) => setRawOptions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium font-mono text-stone-900"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  প্লেসহোল্ডার টেক্সট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: এখানে আপনার এলাকার নাম লিখুন"
                  value={newFieldData.placeholder || ''}
                  onChange={(e) => setNewFieldData({ ...newFieldData, placeholder: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সহায়ক ব্যাখ্যা বা নির্দেশনা (Helper Text)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সঠিক ১১ ডিজিটের নম্বর দিন"
                  value={newFieldData.helperText || ''}
                  onChange={(e) => setNewFieldData({ ...newFieldData, helperText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddField(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewField}
                  className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  প্রশ্ন যুক্ত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Entirely New Form */}
      {showAddFormModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-stone-900">
                নতুন আবেদন ক্যাটাগরি / ফরম তৈরি
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFormModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ফরমে শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অ্যাম্বুলেন্স সেবা আবেদন / রক্তদাতা সংবর্ধনা নিবন্ধন"
                  value={newFormData.title || ''}
                  onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (Subtitle)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: নীলফামারীর বাসিন্দাদের জন্য জরুরি সেবা"
                  value={newFormData.subtitle || ''}
                  onChange={(e) => setNewFormData({ ...newFormData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ব্যাজ লেবেল (Badge)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অ্যাম্বুলেন্স / নিবন্ধন"
                  value={newFormData.badge || ''}
                  onChange={(e) => setNewFormData({ ...newFormData, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  দিকনির্দেশনা (Instructions)
                </label>
                <textarea
                  rows={3}
                  placeholder="আবেদনকারীকে কী কী নিয়ম মানতে হবে..."
                  value={newFormData.instructions || ''}
                  onChange={(e) => setNewFormData({ ...newFormData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddFormModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewForm}
                  className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  ফরম তৈরি করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

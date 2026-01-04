import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  visitCharge?: number; // Added visit charges field
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Electrical',
      subcategories: [
        { id: '1-1', name: 'Wiring & Cabling', categoryId: '1', visitCharge: 500 },
        { id: '1-2', name: 'Switches & Sockets', categoryId: '1', visitCharge: 300 },
        // { id: '1-3', name: 'Lighting Installation', categoryId: '1', visitCharge: 400 },
        // { id: '1-4', name: 'Fans & Appliances', categoryId: '1', visitCharge: 350 },
        // { id: '1-5', name: 'Circuit Breakers & Panels', categoryId: '1', visitCharge: 600 },
        // { id: '1-6', name: 'Inverter & UPS Installation', categoryId: '1', visitCharge: 700 },
        // { id: '1-7', name: 'Solar Panel Setup', categoryId: '1', visitCharge: 1000 },
      ]
    },
    {
      id: '2',
      name: 'Plumbing',
      subcategories: [
        { id: '2-1', name: 'Pipes & Fittings', categoryId: '2', visitCharge: 300 },
        { id: '2-2', name: 'Tap Installation', categoryId: '2', visitCharge: 250 },
        // { id: '2-3', name: 'Drain Cleaning', categoryId: '2', visitCharge: 350 },
        // { id: '2-4', name: 'Leak Repairs', categoryId: '2', visitCharge: 200 },
        // { id: '2-5', name: 'Water Tank Installation', categoryId: '2', visitCharge: 800 },
        // { id: '2-6', name: 'Bathroom Fittings', categoryId: '2', visitCharge: 400 },
        // { id: '2-7', name: 'Kitchen Plumbing', categoryId: '2', visitCharge: 450 },
      ]
    },
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCharge, setNewSubcategoryCharge] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [editSubcategoryCharge, setEditSubcategoryCharge] = useState('');

  // Add Category
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        subcategories: []
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  // Add Subcategory
  const addSubcategory = (categoryId: string) => {
    if (newSubcategoryName.trim()) {
      const newSubcategory: Subcategory = {
        id: Date.now().toString(),
        name: newSubcategoryName.trim(),
        categoryId,
        visitCharge: parseInt(newSubcategoryCharge) || 0,
      };
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
          : cat
      ));
      setNewSubcategoryName('');
      setNewSubcategoryCharge('');
      setShowAddSubcategory(null);
    }
  };

  // Update Category
  const updateCategory = (categoryId: string) => {
    if (editCategoryName.trim()) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, name: editCategoryName.trim() }
          : cat
      ));
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  // Update Subcategory
  const updateSubcategory = (categoryId: string, subcategoryId: string) => {
    if (editSubcategoryName.trim()) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? { ...sub, name: editSubcategoryName.trim(), visitCharge: parseInt(editSubcategoryCharge) || 0 }
                  : sub
              )
            }
          : cat
      ));
      setEditingSubcategory(null);
      setEditSubcategoryName('');
      setEditSubcategoryCharge('');
    }
  };

  // Delete Category
  const deleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category and all its subcategories?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  // Delete Subcategory
  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
            }
          : cat
      ));
    }
  };

  // Start Edit Category
  const startEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  // Start Edit Subcategory
  const startEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory.id);
    setEditSubcategoryName(subcategory.name);
    setEditSubcategoryCharge(subcategory.visitCharge?.toString() || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Categories Management</h1>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
          style={{ backgroundColor: '#05f51d' }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={addCategory}
                className="flex-1 py-2 px-4 rounded-lg text-white"
                style={{ backgroundColor: '#05f51d' }}
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>Add New Subcategory</h3>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Subcategory name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="number"
              value={newSubcategoryCharge}
              onChange={(e) => setNewSubcategoryCharge(e.target.value)}
              placeholder="Visit charge"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => addSubcategory(showAddSubcategory)}
                className="flex-1 py-2 px-4 rounded-lg text-white"
                style={{ backgroundColor: '#05f51d' }}
              >
                Add Subcategory
              </button>
              <button
                onClick={() => {
                  setShowAddSubcategory(null);
                  setNewSubcategoryName('');
                  setNewSubcategoryCharge('');
                }}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              {editingCategory === category.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => updateCategory(category.id)}
                    className="p-2 text-white rounded-lg"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}
                    className="p-2 bg-gray-500 text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold" style={{ color: '#19034d' }}>{category.name}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowAddSubcategory(category.id)}
                      className="px-3 py-1 text-sm rounded-lg text-white"
                      style={{ backgroundColor: '#05f51d' }}
                    >
                      Add Subcategory
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Subcategories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingSubcategory === subcategory.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editSubcategoryName}
                        onChange={(e) => setEditSubcategoryName(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={editSubcategoryCharge}
                        onChange={(e) => setEditSubcategoryCharge(e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => updateSubcategory(category.id, subcategory.id)}
                        className="p-1 text-white rounded"
                        style={{ backgroundColor: '#05f51d' }}
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubcategory(null);
                          setEditSubcategoryName('');
                          setEditSubcategoryCharge('');
                        }}
                        className="p-1 bg-gray-500 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700">{subcategory.name}</span>
                      <span className="text-sm text-gray-500">Rs{subcategory.visitCharge ?? 0}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditSubcategory(subcategory)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteSubcategory(category.id, subcategory.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

export interface ICategoryController {
  getAllCategories(): Promise<any>;
  getCategoryById(id: number): Promise<any>;
  createCategory(category: any): Promise<any>;
  updateCategory(category: any): Promise<any>;
  deleteCategory(id: number): Promise<any>;
}

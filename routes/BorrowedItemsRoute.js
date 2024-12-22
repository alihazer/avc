import express from 'express';
import { createBorrowItem, getBorrowItems, renderCreateBorrowItem, borrowItem, renderBorrowForm, renderEditBorrowItem, editBorrowItem, renderReturnForm, returnBorrowedItem, renderCreateBorrowCategory, createBorrowCategory, getBorrowItemsOfCategory, generateBarcode, renderPrintPage, getAllLogs, getBorrowLog, getBorrowItemsStats} from '../controllers/borrowStock.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import checkPermission from '../middlewares/checkPermission.js';

const router = express.Router();
router.get('/', isLoggedIn, checkPermission('manage_stock') ,getBorrowItems);
router.post('/category/:id/create-item', isLoggedIn, checkPermission('manage_stock'), createBorrowItem);
router.get('/category/:id/create-item', isLoggedIn, checkPermission('manage_stock') ,renderCreateBorrowItem);
router.get('/category/:catId/item/:id/borrow', isLoggedIn, checkPermission('manage_stock') ,renderBorrowForm);
router.post('/category/:catId/item/:id/borrow', isLoggedIn, checkPermission('manage_stock') ,borrowItem);
router.get('/category/:id/edit', isLoggedIn, checkPermission('manage_stock') ,renderEditBorrowItem);
router.put('/category/:id/edit', isLoggedIn, checkPermission('manage_stock') ,editBorrowItem);
router.get('/category/:catId/item/:id/return', isLoggedIn, checkPermission('manage_stock') ,renderReturnForm);
router.put('/return/:id', isLoggedIn, checkPermission('manage_stock') ,returnBorrowedItem);
router.get('/category/create', isLoggedIn, checkPermission('manage_stock') ,checkPermission('add_borrow_category'),renderCreateBorrowCategory);
router.post('/category', isLoggedIn, checkPermission('manage_stock') ,createBorrowCategory);
router.get('/category/:id/items', isLoggedIn, checkPermission('manage_stock') ,getBorrowItemsOfCategory);
router.get('/barcode/:logId', isLoggedIn, checkPermission('manage_stock') ,generateBarcode);
router.get('/category/:catId/item/:id/view', isLoggedIn, checkPermission('manage_stock') ,renderReturnForm);
router.get('/category/:catId/item/:id/print', isLoggedIn, checkPermission('manage_stock'),renderPrintPage);
router.get('/logs/all', isLoggedIn, checkPermission('manage_stock') ,getAllLogs);
router.get('/logs/:id/view', isLoggedIn, checkPermission('manage_stock') ,getBorrowLog);
router.get('/stats/:year', isLoggedIn, checkPermission('view_analytics') ,getBorrowItemsStats);
export default router;
import asyncHandler from "express-async-handler";
import BorrowItem from "../models/BorrowItem.js";
import BorrowLog from "../models/BorrowLog.js";
import BorrowItemCategory from "../models/BorrowItemCategory.js";
import { generateBarcodeBuffer } from "../utils/generateBarcodeBuffer.js";
import moment from "moment";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import ItemBarCode from "../models/ItemBarCode.js";
// @desc create a new item
const createBorrowItem = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const { id } = req.params;


    try {
        const category = await BorrowItemCategory.findById(id);
        const code = category.name.split(" ")[0].toUpperCase() + '_' + uuidv4().substring(0, 3);
        const codeB = await generateBarcodeBuffer(code);
        const barCode = await ItemBarCode.create({
            // Save as base64 string
            barCode: codeB.toString('base64')
        });

        const item = new BorrowItem({
            name,
            category: id,
            image,
            code,
            barCode: barCode._id
        });

        const createdItem = await item.save();
        const itemsInCategory = await BorrowItem.find({ category: id });
        category.quantity =  itemsInCategory.length;
        await category.save();
        res.status(201).redirect('/borrowed-items/category/' + id + '/items');
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Item creation failed");
    }
});




const renderCreateBorrowItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    res.render('createBorrowItem', { id });
});

const borrowItem = asyncHandler(async (req, res) => {
    try {
        const { name, phone_nb, age, difficulty, responsiblePerson, responsiblePersonNumber, expectedReturnDate, notes, imageOnBorrow } = req.body
        const { id } = req.params;
        const item = await BorrowItem.findById(id);
        if (!item) {
            return res.status(404).render('error', { message: "Item not found" });
        }
        if(item.status === "borrowed") {
            return res.status(400).render('error', { message: "Item is already borrowed" });
        }
        item.status = "borrowed";
        await item.save();
        const category = await BorrowItemCategory.findById(item.category);
        if(category.borrowedQuantity === category.quantity) {
            return res.status(400).render('error', { message: "All items in this category are borrowed" });
        }
        const borrowedItems = await BorrowLog.find({ category: item.category ,status: "borrowed" });
        category.borrowedQuantity = borrowedItems.length + 1;
        await category.save();
            const log = new BorrowLog({
                item: id,
                borrower: name,
                phoneNumber: phone_nb,
                borrowDate: new Date(),
                expectedReturnDate,
                responsiblePerson: {
                    name: responsiblePerson,
                    phoneNumber: responsiblePersonNumber
                },
                age,
                difficulty,
                imageOnBorrow,
                notes
            });
    
            await log.save();
            res.status(200).redirect(`/borrowed-items/category/${category._id}/items`);
        }catch (error) {
        console.log(error);
        res.status(400).render('error', { message: "Item borrow failed" });
    }
});

const renderBorrowForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await BorrowItem.findById(id);
    res.render('borrowItem', { item });
});

const getBorrowItems = asyncHandler(async (req, res) => {
    const items = await BorrowItemCategory.find();
    const borrowedItems = await BorrowLog.find({ status: "borrowed" }).populate('item');
    
    res.render('borrowedItems', { items, borrowedItems, moment });
});


const renderEditBorrowItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await BorrowItemCategory.findById(id);
    if(!item) {
        return res.status(404).render('error', { message: "Item not found" });
    }
    res.render('editBorrowCategory', { item });
});


const editBorrowItem = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;
        const item = await BorrowItemCategory.findById(id);
        if(!item) {
            return res.status(404).json({
                status: false,
                message: "Item not found" 
            });
        }
        item.name = name;
        item.quantity = quantity;
        await item.save();
        res.status(200).json({
            status: true,
            message: "Item updated successfully" 
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Item update failed" 
        });
    }
});

const renderReturnForm = asyncHandler(async (req, res) => {
   try {
    let { id } = req.params;
    const reqUrl = req.originalUrl.split('/');
    const log = await BorrowLog.find({item: id, status: "borrowed"}).populate('item').select('-barcode');
    if(!log) {
        return res.status(404).render('error', { message: "Log not found" });
    }
    if(reqUrl[reqUrl.length - 1] === 'view') {
        return res.render('showBorrowLog', { item: log[0], log: log[0], moment });
    }
    return res.render('returnBorrowedItem', {item: log[0], log: log[0], moment });
   } catch (error) {
        console.log(error);
        return res.status(400).render('error', { message: "Error fetching log" });
   }
});

const returnBorrowedItem = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { imageOnReturn, notes } = req.body;
        let log = await BorrowLog.find({_id: id, status: "borrowed"}).populate('item').select('-barcode');
        log = log[0];
        if (!log) {
            return res.status(404).json({
                status: false,
                message: "Log not found" 
            });
        }
        log.imageOnReturn = imageOnReturn;
        const item = await BorrowItem.findById(log.item._id);
        const category = await BorrowItemCategory.findById(item.category);
        if (!item) {
            return res.status(404).json({
                status: false,
                message: "Item not found" 
            });
        }
        const borrowedItems = await BorrowLog.find({ category: item.category ,status: "borrowed" });
        console.log(borrowedItems.length);
        category.borrowedQuantity = borrowedItems.length;
        item.status = "available";
        log.status = "returned";
        log.actualReturnDate = new Date();
        log.notes = notes;

        await category.save();
        await item.save();
        await log.save();
        return res.status(200).json({
            status: true,
            message: "Item returned successfully" 
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: "Item return failed" 
        });
    }
});

const getBorrowedItemsCount = asyncHandler(async (thisMonth = false) => {
    let borrowedItems;
    if (thisMonth) {
        borrowedItems = await BorrowLog.find({ status: "borrowed", borrowDate: { $gte: moment().startOf('month').toDate() } });
    } else {
        borrowedItems = await BorrowLog.find({ status: "borrowed" });
    }
    return borrowedItems;
});

const createBorrowCategory = asyncHandler(async (req, res) => {
    const { name, quantity, image } = req.body;
    try {

        const category = new BorrowItemCategory({
            name,
            quantity,
            image
        });
        const createdCategory = await category.save();
        res.status(201).redirect('/borrowed-items');
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error("Category creation failed");
    }
});

const renderCreateBorrowCategory = asyncHandler(async (req, res) => {
    res.render('createBorrowCategory');
});

const showEditCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await BorrowItemCategory.findById(id);
    if (!category) {
        return res.status(404).render('error', { message: "Category not found" });
    }
    res.render('editBorrowCategory', { category });
});

const getBorrowItemsOfCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const category = await BorrowItemCategory.findById(id);
        const items = await BorrowItem.find({ category : id });

    // Filter out the logs where the populated item is null (i.e., it didn't match the category)
        res.render('allborrowItems', { items, category });
    } catch (error) {
        console.log(error);
        res.status(400).render('error', { message: "Error fetching items" });
    }
});


const generateBarcode = asyncHandler(async(req, res) => {
    try {
        const { logId } = req.params;
        const log = await BorrowLog.findById(logId).populate('item');
        if (!log) {
            return res.status(404).render('error', { message: "Log not found" });
        }
        return res.render('printBarcode', { logInfo: log });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
});

const renderPrintPage = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const item = await BorrowItem.findById(id).populate('barCode');
    console.log(item);
    res.render('printBarCode', { item });
});

export { createBorrowItem, getBorrowItems, renderCreateBorrowItem, borrowItem, renderBorrowForm, renderEditBorrowItem, editBorrowItem, renderReturnForm, returnBorrowedItem, getBorrowedItemsCount, createBorrowCategory, renderCreateBorrowCategory, showEditCategory, getBorrowItemsOfCategory, generateBarcode, renderPrintPage };
import asyncHandler from "express-async-handler";
import BorrowItem from "../models/BorrowItem.js";
import BorrowLog from "../models/BorrowLog.js";
import BorrowItemCategory from "../models/BorrowItemCategory.js";
import { generateBarcodeBuffer } from "../utils/generateBarcodeBuffer.js";
import getLayoutName from "../utils/getLayoutName.js";
import moment from "moment";
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
        const layout = getLayoutName(req);
        if (!item) {
            return res.status(404).render('error', { message: "Item not found", layout });
        }
        if(item.status === "borrowed") {
            return res.status(400).render('error', { message: "Item is already borrowed", layout });
        }
        item.status = "borrowed";
        await item.save();
        const category = await BorrowItemCategory.findById(item.category);
        if(category.borrowedQuantity === category.quantity) {
            return res.status(400).render('error', { message: "All items in this category are borrowed", layout });
        }
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
            const borrowedItems = await BorrowItem.find({ category: item.category, status: "borrowed" });
            category.borrowedQuantity = borrowedItems.length;
            await category.save();
            res.status(200).redirect(`/borrowed-items/category/${category._id}/items`);
        }catch (error) {
        console.log(error);
        res.status(400).render('error', { message: "Item borrow failed", layout });
    }
});

const renderBorrowForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await BorrowItem.findById(id);
    res.render('borrowItem', { item });
});

const getBorrowItems = asyncHandler(async (req, res) => {
    const layout = getLayoutName(req);
    const items = await BorrowItemCategory.find();
    const borrowedItems = await BorrowLog.find({ status: "borrowed" }).populate('item');
    
    res.render('borrowedItems', { items, borrowedItems, moment, layout });
});


const renderEditBorrowItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const layout = getLayoutName(req);
    const item = await BorrowItemCategory.findById(id);
    if(!item) {
        return res.status(404).render('error', { message: "Item not found" , layout});
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
    const layout = getLayoutName(req);
    let { id } = req.params;
    const reqUrl = req.originalUrl.split('/');
    const log = await BorrowLog.find({item: id, status: "borrowed"}).populate('item').select('-barcode');
    if(!log) {
        return res.status(404).render('error', { message: "Log not found", layout });
    }
    if(reqUrl[reqUrl.length - 1] === 'view') {
        return res.render('showBorrowLog', { item: log[0], log: log[0], moment, layout });
    }
    return res.render('returnBorrowedItem', {item: log[0], log: log[0], moment, layout });
   } catch (error) {
        console.log(error);
        return res.status(400).render('error', { message: "Error fetching log", layout });
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
        item.status = "available";
        log.status = "returned";
        log.actualReturnDate = new Date();
        log.notes = notes;


        await item.save();
        await log.save();
        const borrowedItems = await BorrowItem.find({ category: item.category, status: "borrowed" });
        category.borrowedQuantity = borrowedItems.length;
        await category.save();
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
    const layout = getLayoutName(req);
    res.render('createBorrowCategory', {layout});
});

const showEditCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const layout = getLayoutName(req);
    const category = await BorrowItemCategory.findById(id);
    if (!category) {
        return res.status(404).render('error', { message: "Category not found", layout });
    }
    res.render('editBorrowCategory', { category, layout });
});

const getBorrowItemsOfCategory = asyncHandler(async (req, res) => {
    try {
        const layout = getLayoutName(req);
        const { id } = req.params;
        const category = await BorrowItemCategory.findById(id);
        const items = await BorrowItem.find({ category : id });

    // Filter out the logs where the populated item is null (i.e., it didn't match the category)
        res.render('allborrowItems', { items, category, layout});
    } catch (error) {
        console.log(error);
        res.status(400).render('error', { message: "Error fetching items", layout });
    }
});


const generateBarcode = asyncHandler(async(req, res) => {
    try {
        const layout = getLayoutName(req);
        const { logId } = req.params;
        const log = await BorrowLog.findById(logId).populate('item');
        if (!log) {
            return res.status(404).render('error', { message: "Log not found" });
        }
        return res.render('printBarcode', { logInfo: log, layout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
});

const renderPrintPage = asyncHandler(async(req, res) => {
    const layout = getLayoutName(req);
    const id = req.params.id;
    const item = await BorrowItem.findById(id).populate('barCode');
    res.render('printBarCode', { item, layout});
});

const getAllLogs = asyncHandler(async(req, res) => {
    const layout = getLayoutName(req);
    const logs = await BorrowLog.find()
    .populate('item')
    .sort({borrowDate: -1});
    res.render('logHistory', { logs, moment, layout });
});

const getBorrowLog = asyncHandler(async(req, res) => {
    const layout = getLayoutName(req);
    const id = req.params.id;
    const log = await BorrowLog.findById(id).populate('item');
    res.render('viewBorrowLog', { item: log, log, moment, layout });
});


const getBorrowItemsStats = asyncHandler(async(req, res) => {
    const year = parseInt(req.params.year);

    try {
        const pipeline = [
            {
                $match: {
                    borrowDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            },
            {
                $lookup: {
                    from: 'borrowitems',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'itemDetails'
                }
            },
            {
                $unwind: '$itemDetails'
            },
            {
                $lookup: {
                    from: 'borrowitemcategories',
                    localField: 'itemDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $group: {
                    _id: {
                        category: '$categoryDetails.name',
                        month: { $month: '$borrowDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.category',
                    data: {
                        $push: {
                            month: '$_id.month',
                            count: '$count'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    data: 1
                }
            }
        ];

        const result = await BorrowLog.aggregate(pipeline);
        const totalCounts = await BorrowLog.aggregate([
            {
                $match: {
                    borrowDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            },
            {
                $count: 'totalCases'
            }
        ]);

        res.json({
            borrowData: result,
            totalCases: totalCounts.length > 0 ? totalCounts[0].totalCases : 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch borrow statistics' });
    }
});

export { getBorrowItemsStats ,createBorrowItem, getBorrowItems, renderCreateBorrowItem, borrowItem, renderBorrowForm, renderEditBorrowItem, editBorrowItem, renderReturnForm, returnBorrowedItem, getBorrowedItemsCount, createBorrowCategory, renderCreateBorrowCategory, showEditCategory, getBorrowItemsOfCategory, generateBarcode, renderPrintPage , getAllLogs, getBorrowLog };
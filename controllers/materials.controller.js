import CarLog from "../models/CarLog.js";
import Material from "../models/Material.js";
import asyncHandler from "express-async-handler";
import moment from "moment";
import getLayoutName from "../utils/getLayoutName.js";

export const getMaterials = asyncHandler(async (req, res) => {
    try {
        const layout = await getLayoutName(req);
        const materials = await Material.find();
        res.status(200).render('allMaterials', { materials: materials, layout });
    } catch (error) {
        const layout = await getLayoutName(req);
        res.status(404).render('error', { message: error.message, layout });
    }
});

export const getMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const material = await Material.findById(id);
        res.status(200).render('material', { material: material });
    } catch (error) {  
        throw new Error('Material not found');
    }
});

export const createMaterial = asyncHandler(async (req, res) => {
    const { name, quantity, image } = req.body;
    if(!name || !quantity || !image) {
        res.status(400).json({ message: 'All fields are required' });
    }
    const newMaterial = await Material.create({ name, quantity, image });
    if(!newMaterial) {
        return res.status(400).render('error', { message: 'Material not created' });
    }
    try {
        res.status(201).redirect('/materials');
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export const updateMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;
    console.log(req.body);
    if(!name || !quantity) {
        console.log('All fields are required');
        return res.status(400).json({ message: 'All fields are required' });

    }
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(id, { name, quantity }, { new: true });
        if(!updatedMaterial) {
            console.log('Material not found');
            return res.status(404).json({ message: 'Material not found' });
        }
        console.log('Material updated successfully');
        return res.status(200).json({
            status: true,
            message: 'Material updated successfully',
        })
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export const deleteMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const material = await Material.findByIdAndDelete(id);
        if(!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        return res.status(200).json({message: 'Material deleted successfully'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export const getMaterialForm = asyncHandler(async (req, res) => {
    res.status(200).render('addMaterial');
});

export const getUpdateMaterialForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const layout = await getLayoutName(req);
    try {
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).render('error', { message: 'Material not found', layout });
        }
        return res.status(200).render('updateMaterial', { material: material , layout});
    } catch (error) {
        res.status(404).render('error', { message: error.message, layout });
    }
});


export const getItemsUsed = asyncHandler(async (req, res) => {
    try {
        const filter = req.query.filter || 'month';
        const itemsUsed = {
            total: 0,
            materials: []
        };

        let startDate, endDate;

        if (filter === 'month') {
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (filter === 'year') {
            const now = new Date();
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear() + 1, 0, 0);
        } else {
            return res.status(400).json({ message: 'Invalid filter parameter' });
        }

        const logsUsed = await CarLog.find({
            action: 'Used',
            createdAt: { $gte: startDate, $lt: endDate }
        })
        .populate('materials_added._id')
        .populate('carId')
        .exec();

        itemsUsed.materials = logsUsed.flatMap(log =>
            log.materials_added.map(material => ({
                name: material._id.name,
                quantity: material.quantity,
                car_nb: log.carId.number,
                date: moment(log.createdAt).format('DD-MM-YYYY')
            }))
        );

        itemsUsed.total = logsUsed.reduce((total, log) =>
            total + log.materials_added.reduce((subTotal, material) =>
                subTotal + material.quantity, 0), 0);

        return res.status(200).json({ itemsUsed });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});


export const getItemsThisMonth = asyncHandler(async ()=>{
    const thisMonth = new Date().getMonth();
    const logsUsed = await CarLog.find({action: 'Used', createdAt: {$gte: new Date(new Date().getFullYear(), thisMonth, 1), $lt: new Date(new Date().getFullYear(), thisMonth + 1, 0) }}).populate('materials_added._id').populate('carId').exec();
    const itemsUsed = logsUsed.map((log)=>{
        // Make them in array of object each one with name and quantity
        return log.materials_added.map((material)=>{
            return {
                name: material._id.name,
                quantity: material.quantity,
                car_nb: log.carId.number,
                date: moment(log.createdAt).format('DD-MM-YYYY')
            }
        });
    }
    );
    return itemsUsed;
});


export const renderItemsUsed = asyncHandler(async (req, res)=>{
    return res.render('materialsUsed');
});




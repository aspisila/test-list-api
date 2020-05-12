import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Item } from "../entity/Item";

class ItemController{
    static listAll = async (req: Request, res: Response) => {
        const itemRepository = getRepository(Item);
        const items = await itemRepository.find({
            select: ["id", "name"]
        });
        
        res.send(items);
};

    static getOneById = async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        const itemRepository = getRepository(Item);
        try {
            const item = await itemRepository.findOneOrFail(id, {
                select: ["id", "name"]
            });

            res.send(item);
        } 
        catch (error) {
            res.status(404).send("Item not found");
        }
    };

    static newItem = async (req: Request, res: Response) => {
        let { name } = req.body;
        let item = new Item();
        
        item.name = name;

        //Validade if the parameters are ok
        const errors = await validate(item);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, 
        const itemRepository = getRepository(Item);
        try {
            await itemRepository.save(item);
        }
        catch (e) {
            res.status(400).send("error");
            
            return;
        }

        res.status(201).send(item);
    };

    static editItem = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name } = req.body;

        const itemRepository = getRepository(Item);
        let item;
        try {
            item = await itemRepository.findOneOrFail(id);
        }
        catch (error) {
            res.status(404).send("Item not found");
            return;
        }

        //Validate the new values on model
        item.name = name;
        const errors = await validate(item);
        if (errors.length > 0) {
            res.status(400).send(errors);

            return;
        }

        try {
            await itemRepository.save(item);
        } catch (e) {
            res.status(400).send("error ocurred");
            return;
        }
        
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static deleteItem = async (req: Request, res: Response) => {
        const id = req.params.id;
        const itemRepository = getRepository(Item);
        let item: Item;

        try {
            item = await itemRepository.findOneOrFail(id);
        }
        catch (error) {
            res.status(404).send("Item not found");
            return;
        }
        
        itemRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static deleteAll = async (req: Request, res: Response) => {
        const items = req.body;
        const itemRepository = getRepository(Item);
        let item: Item;
        let errors = [];
        
        items.map(async (id) => {
            try {
                item = await itemRepository.findOneOrFail(id);
            }
            catch (error) {
                errors.push(`Item not found: (${id})`);                
            }

            itemRepository.delete(id);
        });

        if(errors.length) {
            res.status(400).send(errors);
            return;
        }

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
};

export default ItemController;
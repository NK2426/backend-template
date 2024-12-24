const EventEmitter = require("events")
const Invoiceitem = require("../models/app/invoiceitemModel");
const Item = require("../models/app/itemsModel");
const Notifications = require("../models/app/notificationsModel");
const Inwarditems = require("../models/inwarditemsModel");
const Shelfing = require("../models/shelfingModel");

class UtilityEvent extends EventEmitter {
    constructor() {
        super()
    }
    updateShelfCount(psids = []) {
        if (psids) {
            Inwarditems.findAll({
                where: { psid: psids },
            })
                .then(async (inwarditems) => {
                    if (inwarditems) {
                        inwarditems.map(async(inwarditem) => {
                            await Shelfing.findOne({ where: { id: inwarditem.shelf_id } }).then(async (shelf) => {
                                if (shelf) {
                                    let itemCount = shelf.itemcount - 1;
                                    let availableCount = shelf.available + 1;
                                    itemCount = itemCount < 0 ? 0 : itemCount;
                                    //availableCount = availableCount < 0 ? 0 : availableCount
                                    if (shelf) {
                                        await shelf.update({ itemcount: itemCount, available: availableCount })
                                    }
                                }
                            })
                        })

                    }
                });
        }
    }
    createNotification(invoiceuuid) {
        if (invoiceuuid) {
            Invoiceitem.findAll({
                attributes: ['uuid', 'orderitem_uuid', 'invoice_uuid', 'user_id', 'status'],
                include: [
                    { attributes: ['name', 'path'], model: Item, raw: true },
                ],
                where: { invoice_uuid: invoiceuuid },
            })
                .then(async (invoiceitems) => {
                    if (invoiceitems) {
                        //invoiceitems = invoiceitems.get({ plain: true })
                        let status = '';
                        invoiceitems.map(async(invoiceitemval) => {
                            await Notifications.findOne({ where: { link: invoiceitemval.orderitem_uuid, user_id: invoiceitemval.user_id } }).then(async (notification) => {
                                if (!notification) {
                                    status = invoiceitemval.status == 'Create' ? 'Packed' : invoiceitemval.status;
                                    await Notifications.create({ user_id: invoiceitemval.user_id, title: 'Your order has been ' + status, description: invoiceitemval.item.name, link: invoiceitemval.orderitem_uuid, path: invoiceitemval.item.path, type: 'Order', send: 0 })
                                }
                            })
                        })

                    }
                });
        }
    }
}

module.exports = UtilityEvent
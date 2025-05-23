import { PaymentInfo } from "@/app/vezerlopult/megrendelesek/page";

export default function Payment({
    payment
}: {
    payment: PaymentInfo
}) {
    return (
        <>
            <div className="row orderHistoryRow my-3">
                <div className="col-12 col-lg-9">
                    <div className="orderHistoryId">ID: <span className="text-break">{payment.id}</span></div>
                </div>
                <div className="col-12 col-lg-3 text-end">
                    <div>Összeg: <span className="text-Blue">{payment.amount.toLocaleString()} .-</span></div>
                </div>
                <hr className="my-2" />
                <div className="col-12 col-lg-4">
                    <div>
                        Státusz: <span className={payment.status}>{payment.status}</span>
                    </div>
                    <div>
                        Dátum: <span>{new Date(payment.created).toLocaleDateString('hu-HU')}</span>
                    </div>
                </div>
                <div className="col-12 col-lg-8">
                    <div>Termékek:</div>
                    <div className="orderHistoryItemsWrap">
                        {payment.items?.map((item, index) => (
                            <div key={index} className="orderHistoryItem">
                                <div className="col-11 text-nowrap text-truncate pe-2 pe-sm-0">{item.name}</div>
                                <div className="col-1 d-flex justify-content-end"><span className="text-Orange me-1">{item.quantity}</span> db</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
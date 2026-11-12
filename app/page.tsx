"use client";
import { useState, useEffect } from "react";

interface Order {
  id: number;
  trackNumber: string;
  address: string;
  cost: number;
  status: "В пути" | "Доставлен";
}

export default function LogiTrackPage() {
  const [formData, setFormData] = useState({
    trackNumber: "",
    address: "",
    cost: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      trackNumber: "TRK-9082",
      address: "Москва, ул.Ленина 15 ",
      cost: 4500,
      status: "В пути",
    },
    {
      id: 2,
      trackNumber: "TRK-1145",
      address: "Красноярск, ул.Мира 45 ",
      cost: 12800,
      status: "Доставлен",
    },
  ]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("logitrack_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("logitrack_orders", JSON.stringify(orders));
    }
  }, [orders, isMounted]);

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  const handleAddOrder = () => {
    if (!formData.trackNumber.trim() || !formData.address.trim()) return;

    const newOrder: Order = {
      id: Date.now(),
      trackNumber: formData.trackNumber,
      address: formData.address,
      cost: Number(formData.cost) || 0,
      status: "В пути",
    };

    setOrders([...orders, newOrder]);

    setFormData({
      trackNumber: "",
      address: "",
      cost: "",
    });
  };

  const totalCost = orders.reduce((sum, order) => {
    return sum + order.cost;
  }, 0);

  const inTransitCount = orders.filter(
    (order) => order.status === "В пути",
  ).length;

  const handleToggleStatus = (idToUpdate: number) => {
    setOrders(
      orders.map((order) => {
        return order.id === idToUpdate
          ? {
              ...order,
              status: order.status === "В пути" ? "Доставлен" : "В пути",
            }
          : order;
      }),
    );
  };

  const handleDeleteOrder = (idToDelete: number) => {
    setOrders(orders.filter((order) => order.id !== idToDelete));
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-wider text-emerald-400 uppercase">
          LogiTrack // Панель Управления Доставкой
        </h1>
        <p className="text-xs text-slate-500 my-1">
          Мониторинг грузов в реальном времени
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Всего отправлено
          </span>
          <span className="text-2xl font-black text-slate-200">
            {orders.length} шт.
          </span>
        </div>

        <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Сейчас в пути
          </span>
          <span className="text-2xl font-black text-amber-400">
            {inTransitCount} шт.
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:text-right">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Общая стоимость грузов
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {totalCost.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-3xl flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Номер трека
          </label>
          <input
            type="text"
            value={formData.trackNumber}
            onChange={(e) =>
              setFormData({ ...formData, trackNumber: e.target.value })
            }
            placeholder="Например, TRK-5521"
            className="bg-slate-950 border border-slate-800 focus:border-emerald-500/50 px-4 py-2 rounded-xl text-white text-sm outline-none transition-colors w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Адрес доставки
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Город, улица, дом"
            className="bg-slate-950 border border-slate-800 focus:border-emerald-500/50 px-4 py-2 rounded-xl text-white text-sm outline-none transition-colors w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Стоимость (₽)
          </label>
          <input
            type="text"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="0"
            className="bg-slate-950 border border-slate-800 focus:border-emerald-500/50 px-4 py-2 rounded-xl text-white text-sm outline-none transition-colors w-full"
          />
        </div>

        <button
          onClick={handleAddOrder}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-5 py-2 rounded-xl font-black text-sm active:scale-95 transition-all h-9 w-full sm:w-auto whitespace-nowrap"
        >
          + ГРУЗ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl hover:border-emerald-500/30 transition-all"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-mono text-sm font-bold text-slate-300">
                📦{order.trackNumber}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${
                  order.status === "В пути"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                Адрес доставки
              </span>
              <span className="text-sm font-medium text-slate-200">
                {order.address}
              </span>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Стоимость груза
                </span>
                <span className="text-base font-black text-emerald-400">
                  {order.cost.toLocaleString("ru-RU")}₽
                </span>
              </div>

              <button
                onClick={() => handleToggleStatus(order.id)}
                className="text-[11px] font-bold bg-slate-950 border border-slate-800 hover:border-slate-700 px-2 py-1.5 rounded-xl transition-all active:scale-95 text-slate-400 hover:text-slate-200"
              >
                Изменить статус
              </button>
              <button
                onClick={() => handleDeleteOrder(order.id)}
                title="Удалить груз"
                className="text-[11px] font-bold bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 px-2.5 py-1.5 rounded-xl transition-all active:scale-95 text-slate-500"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, ListTodo } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const BucketList = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        const q = query(collection(db, "bucketlist"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsData);
        }, (error) => {
            console.error("Error loading bucket list:", error);
        });
        return () => unsubscribe();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            await addDoc(collection(db, "bucketlist"), {
                text: newItem,
                completed: false,
                createdAt: serverTimestamp()
            });
            setNewItem('');
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const toggleComplete = async (item) => {
        try {
            await updateDoc(doc(db, "bucketlist", item.id), {
                completed: !item.completed
            });
        } catch (error) {
            console.error("Error toggling item:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar este deseo?")) return;
        try {
            await deleteDoc(doc(db, "bucketlist", id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ListTodo color="var(--primary-color)" />
                <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Lista de Deseos</h3>
            </div>

            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Escribe un sueño..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}
                />
                <button type="submit" style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    width: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}>
                    <Plus size={20} />
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                        Aún no hay deseos. ¡Agreguen el primero! ✨
                    </p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            background: item.completed ? '#f0fdf4' : '#fff',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                            transition: 'all 0.2s'
                        }}>
                            <button
                                onClick={() => toggleComplete(item)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: item.completed ? '#22c55e' : '#ccc',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>

                            <span style={{
                                flex: 1,
                                textDecoration: item.completed ? 'line-through' : 'none',
                                color: item.completed ? '#888' : '#333'
                            }}>
                                {item.text}
                            </span>

                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ff4d6d',
                                    opacity: 0.6
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BucketList;

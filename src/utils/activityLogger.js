import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy, limit } from 'firebase/firestore';

// Limpiar logs antiguos (más de 2 días)
const cleanupOldLogs = async () => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const q = query(
            collection(db, "activity_log"),
            where("createdAt", "<", twoDaysAgo)
        );

        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error cleaning old logs:", error);
    }
};

// Verificar si hay una actividad de foto reciente (últimos 5 min) en la misma carpeta
const checkRecentPhotoActivity = async (folderName) => {
    try {
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

        const q = query(
            collection(db, "activity_log"),
            where("icon", "==", "photo"),
            where("createdAt", ">", fiveMinutesAgo),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const recentLog = snapshot.docs[0];
            const data = recentLog.data();

            // Verificar si es de la misma carpeta
            if (data.details && data.details.includes(folderName)) {
                return { exists: true, logId: recentLog.id, data };
            }
        }
        return { exists: false };
    } catch (error) {
        console.error("Error checking recent photo activity:", error);
        return { exists: false };
    }
};

export const logActivity = async (action, details, icon = 'info', folderName = null) => {
    try {
        // Limpiar logs antiguos cada vez que se registra una actividad
        cleanupOldLogs();

        // Si es una foto, verificar si hay actividad reciente para agrupar
        if (icon === 'photo' && folderName) {
            const recentActivity = await checkRecentPhotoActivity(folderName);

            if (recentActivity.exists) {
                // Actualizar el log existente en lugar de crear uno nuevo
                await updateDoc(doc(db, "activity_log", recentActivity.logId), {
                    action: 'Nuevas Fotos',
                    details: `Se agregaron fotos al álbum "${folderName}"`,
                    createdAt: serverTimestamp() // Actualizar timestamp
                });
                return;
            }
        }

        // Crear nuevo log
        await addDoc(collection(db, "activity_log"), {
            action,
            details,
            icon,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};


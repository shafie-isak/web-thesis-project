import UserActivity from '../models/user_activity.js';

export const logActivity = async (req, res) => {
    try {
        const { userId, type, action, metadata = {} } = req.body;


        const activity = new UserActivity({ userId, type, action, metadata });
        await activity.save();

        const io = req.app.get('io');
        const populatedActivity = await activity.populate('userId', 'name email role profilePicture');
        io.emit('new-activity', populatedActivity);  // 👈 broadcast to frontend

        res.status(201).json({ success: true, activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllActivities = async (req, res) => {
    try {
        const { userId, role, from, to } = req.query;

        const filter = {};
        if (userId) filter.userId = userId;
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const activities = await UserActivity.find(filter)
            .sort({ createdAt: -1 })
            .populate("userId", "name email role profilePicture");

        const filteredByRole = role
            ? activities.filter(a => a.userId?.role === role)
            : activities;

        res.status(200).json({ success: true, activities: filteredByRole });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;

        const activities = await UserActivity.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getActivityStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ];

        const results = await UserActivity.aggregate(pipeline);

        const dates = [];
        const counts = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const entry = results.find(r => r._id === dateStr);
            dates.push(dateStr);
            counts.push(entry ? entry.count : 0);
        }

        res.json({ dates, counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
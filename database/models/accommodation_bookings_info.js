import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import User from './user';
import Event from './events/event';
import Housing from './housing/housing';
import MyOrders from './my_orders_modal';
// import Orders from './tickets/orders';

const initAccommodationBookingInfo = (sequelize, Types) => {
    class AccommodationBookingInfo extends Model { }

    AccommodationBookingInfo.init(
        {
            id: {
                type: Types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Types.INTEGER,
                allowNull: false,
            },
            event_id: {
                type: Types.INTEGER,
                allowNull: false,
            },
            total_night_stay: {
                type: Types.INTEGER,
                allowNull: false,
            },
            first_name: {
                type: Types.STRING,
                allowNull: false,
            },
            last_name: {
                type: Types.STRING,
                allowNull: false,
            },
            email: {
                type: Types.STRING,
                allowNull: false,
            },
            accommodation_id: {
                type: Types.INTEGER,
                allowNull: false,
            },
            accommodation_name: {
                type: Types.STRING,
            },
            check_in_date: {
                type: Types.DATE,
            },
            check_out_date: {
                type: Types.DATE,
            },
            guests_count: {
                type: Types.INTEGER,
                defaultValue: 1,
            },
            no_of_bedrooms: {
                type: Types.INTEGER,
            },
            status: {
                type: Types.ENUM('Y', 'N'),
                allowNull: false,
                defaultValue: 'Y',
            },
            total_amount: {
                type: Types.FLOAT,
                defaultValue: 0,
            },
            paid_amount: {
                type: Types.FLOAT,
                defaultValue: 0,
            },
            payment_status: {
                type: Types.ENUM('partial', 'full', 'pending'),
                allowNull: false,
                defaultValue: 'full',
            },
            payment_method: {
                type: Types.STRING,
            },
            transaction_id: {
                type: Types.STRING,
            },
            order_id: {
                type: Types.INTEGER,
            },
            payment_id: {
                type: Types.INTEGER,
            },
            qr_code_image: {
                type: Types.STRING,
            },
            created_at: {
                type: Types.DATE,
                defaultValue: Types.NOW,
            },
            updated_at: {
                type: Types.DATE,
                defaultValue: Types.NOW,
            },
        },
        {
            sequelize,
            modelName: 'AccommodationBookingInfo',
            tableName: 'accommodation_bookings_info',
            underscored: true,
            timestamps: true, // set to true if you're using Sequelize's automatic timestamps
        }
    );

    // Associations
    AccommodationBookingInfo.belongsTo(User, {
        foreignKey: 'user_id',
    });

    AccommodationBookingInfo.belongsTo(Event, {
        foreignKey: 'event_id',
    });

    AccommodationBookingInfo.belongsTo(Housing, {
        foreignKey: 'accommodation_id',
    });


    AccommodationBookingInfo.belongsTo(MyOrders, {
        foreignKey: 'order_id',
    });

    // AccommodationBookingInfo.belongsTo(Orders, {
    //     foreignKey: "order_id",
    // });

    return AccommodationBookingInfo;
};

export default initAccommodationBookingInfo(connection, DataTypes);

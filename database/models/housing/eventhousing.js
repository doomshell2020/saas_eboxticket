import { Model, DataTypes } from 'sequelize';
import connection from '../../connection';
// import Housing from "./housing";


const initEventHousing = (sequelize, DataTypes) => {
    class EventHousing extends Model { }

    EventHousing.init(
        {
            EventID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            HousingID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Status: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            InternalNotes: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            NightlyPrice: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            BaseNightlyPrice: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            totalAfterTaxes: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            NightlyPayoutAmount: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            AvailabilityStartDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            AvailabilityEndDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ServiceFee: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            MexicanVAT: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            AccommodationTax: {
                type: DataTypes.STRING,
                allowNull: true,
            }, OndalindaFee: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            TotalOndalindaFeeAmount: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            TotalStripeFeeAmount: {
                type: DataTypes.STRING,
                allowNull: true,
            }
            , stripe_fee: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            OwnerAmount: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ticket_stripe_fee_percentage: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            ticket_bank_fee_percentage: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            ticket_processing_fee_percentage: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            // new
            ServiceFeeAmount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            MexicanVATAmount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            AccommodationTaxAmount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            OndalindaFeeAmount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            stripe_fee_amount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            ticket_bank_fee_amount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            ticket_processing_fee_amount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            ticket_stripe_fee_amount: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
                defaultValue: 0.00,
            },
            isBooked: {
                type: DataTypes.ENUM('Y', 'N', 'P'),
                allowNull: false,
                defaultValue: 'N',
            },
            isDateExtensionRequestedSent: {
                type: DataTypes.ENUM('Y', 'N', 'B'),
                allowNull: false,
                defaultValue: 'N',
            },
            extensionCheckInDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            extensionCheckOutDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            extensionRequestedBy: {
                type: DataTypes.STRING, // or DataTypes.INTEGER if it's a user ID
                allowNull: true,
            },
            extensionRequestedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'EventHousing',
            tableName: 'eventhousing',
        }
    );

    // EventHousing.belongsTo(Housing, {
    //     foreignKey: 'HousingID',
    // })

    return EventHousing;
};

export default initEventHousing(connection, DataTypes);

module.exports = (sequelize, DataTypes) => {
  const UsageEvent = sequelize.define('UsageEvent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    api_key_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    service_type: {
      type: DataTypes.ENUM('sms', 'email'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'usage_events',
    timestamps: false,
  });

  return UsageEvent;
};
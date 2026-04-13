module.exports = (sequelize, DataTypes) => {
  const SmsLog = sequelize.define('SmsLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    api_key_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    to_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('queued', 'sent', 'failed'),
      defaultValue: 'queued',
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sms_logs',
    timestamps: false,
  });

  return SmsLog;
};
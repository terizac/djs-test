// tuya developer platform
// https://developer.tuya.com/cn/docs/iot/industry_project?id=Kakqfh93hgchi




// face 192.0.0.64
property 
// create, read, update, delete
member
// create, read, update, delete
notification
// create, read, update, delete

// 门锁基础 API
// https://developer.tuya.com/cn/docs/app-development/lockbaseapi?id=Kceuhev5rrhg4


"model": "{\"modelId\":\"000003vq62\",\"services\":[{\"actions\":[],\"code\":\"\",\"description\":\"\",\"events\":[],\"name\":\"默认服务\",\"properties\":[{\"abilityId\":1,\"accessMode\":\"rw\",\"code\":\"unlock_method_create\",\"description\":\"【必选】App蓝牙近距离连接门锁后，进行开门方式的创建操作，支持指纹、密码、卡等方式的创建\",\"name\":\"添加开门方式\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":2,\"accessMode\":\"rw\",\"code\":\"unlock_method_delete\",\"description\":\"【必选】App蓝牙近距离连接门锁后，进行开门方式的删除操作，支持指纹、密码、卡等方式的删除\",\"name\":\"删除开门方式\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":3,\"accessMode\":\"rw\",\"code\":\"unlock_method_modify\",\"description\":\"【必选】App蓝牙近距离连接门锁后，进行开门方式的修改操作，支持指纹、密码、卡等方式的修改\",\"name\":\"修改开门方式\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":6,\"accessMode\":\"rw\",\"code\":\"bluetooth_unlock\",\"description\":\"【手机蓝牙解锁必选之一】\\n【支持蓝牙配件不能选择该dp，需选择dp71，与70&71互斥，2选1】\",\"extensions\":{\"attribute\":\"512\"},\"name\":\"蓝牙解锁\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":8,\"accessMode\":\"ro\",\"code\":\"residual_electricity\",\"description\":\"【可选，但必须二选一】门锁上报电量百分比。剩余电量与电量状态，必须二选一   默认值为-1时不显示电量\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"剩余电量\",\"typeSpec\":{\"type\":\"value\",\"max\":100,\"min\":-1,\"scale\":0,\"step\":1}},{\"abilityId\":12,\"accessMode\":\"ro\",\"code\":\"unlock_fingerprint\",\"description\":\"【可选】指纹在门锁上录入，录入完成后由硬件分配id，发生指纹解锁后，门锁将上报该dp点。请用记录型上报\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"指纹解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":13,\"accessMode\":\"ro\",\"code\":\"unlock_password\",\"description\":\"【可选】普通密码在门锁上录入，录入完成后由硬件分配id，发生普通密码解锁后，门锁将上报该dp点。普通密码指在门锁硬件上创建的密码，不包含通过app创建的临时密码。请用记录型上报\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"密码解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":14,\"accessMode\":\"ro\",\"code\":\"unlock_dynamic\",\"description\":\"【可选】普通密码在门锁上录入，录入完成后由硬件分配id，发生普通密码解锁后，门锁将上报该dp点。普通密码指在门锁硬件上创建的密码，不包含通过app创建的临时密码。请用记录型上报\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"动态密码解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":15,\"accessMode\":\"ro\",\"code\":\"unlock_card\",\"description\":\"【可选】卡片在门锁上录入，录入完成后由硬件分配id，发生卡片解锁后，门锁将上报该dp点。请用记录型上报\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"卡片解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":19,\"accessMode\":\"ro\",\"code\":\"unlock_ble\",\"description\":\"【必须】请用记录型上报成功上报：成员+蓝牙开门+时间（开门记录）\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"蓝牙解锁记录\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":21,\"accessMode\":\"ro\",\"code\":\"alarm_lock\",\"description\":\"【必选】0=指纹试错报警、1=密码试错报警、2=卡试错报警、3=人脸试错报警、4=假锁（锁舌卡住）、5=高温报警、6=超时未关门、7=电子锁舌未弹出、8=防撬报警 、9=钥匙插入、10=低电报警、11=电量耗尽报警、12=震动报警、13=布防报警。低电暂时保留使用单独的dp点的设计，如果使用了本dp点中的低电报警值，就不要使用11dp点\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"门锁告警\",\"typeSpec\":{\"type\":\"enum\",\"range\":[\"wrong_finger\",\"wrong_password\",\"wrong_card\",\"wrong_face\",\"tongue_bad\",\"too_hot\",\"unclosed_time\",\"tongue_not_out\",\"pry\",\"key_in\",\"low_battery\",\"power_off\",\"shock\",\"defense\"]}},{\"abilityId\":22,\"accessMode\":\"ro\",\"code\":\"hijack\",\"description\":\"【可选】该功能默认不需要硬件实现，门锁不用做劫持判断，只要在app上标记解锁id即可\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"劫持告警\",\"typeSpec\":{\"type\":\"bool\"}},{\"abilityId\":33,\"accessMode\":\"rw\",\"code\":\"automatic_lock\",\"description\":\"【可选】自动落锁/不自动落锁，仅使用本dp点，可以实现自动落锁与不自动落锁（即常开模式）的切换。\\n可选配合下一个dp自动落锁延时，组合实现以下功能：\\n1、默认时长自动落锁\\n2、指定时长自动落锁\\n3、常开\\n自动落锁最小延时1，最大1800，单位秒\",\"extensions\":{\"iconName\":\"icon-power\",\"attribute\":\"1280\",\"trigger\":\"direct\"},\"name\":\"自动落锁开关\",\"typeSpec\":{\"type\":\"bool\"}},{\"abilityId\":36,\"accessMode\":\"rw\",\"code\":\"auto_lock_time\",\"description\":\"自动落锁开启后，需设定每次解锁后距离自动落锁之间的延时，下发给门锁本地保存参数，设置时长1s到30分钟\",\"extensions\":{\"iconName\":\"icon-dp_time3\",\"attribute\":\"1280\",\"trigger\":\"direct\"},\"name\":\"落锁延迟时间\",\"typeSpec\":{\"type\":\"value\",\"max\":120,\"min\":1,\"scale\":0,\"step\":1,\"unit\":\"\"}},{\"abilityId\":44,\"accessMode\":\"rw\",\"code\":\"rtc_lock\",\"description\":\"【注意】\\n如门锁硬件支持RTC，请勾选该dp；如不支持RTC，则不要勾选；如未勾选，则默认为不支持RTC\\n\\n该dp点表示，门锁硬件是否本地带有RTC时钟，如包含RTC时钟，才能在门锁上添加有时效限制的开门方式，否则硬件上添加的开门方式都是永久有效，时效性控制只会出现在app的时效性上，由云端控制\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"硬件本地RTC时钟\",\"typeSpec\":{\"type\":\"bool\"}},{\"abilityId\":46,\"accessMode\":\"rw\",\"code\":\"manual_lock\",\"description\":\"【可选】当锁具被解锁后，不会自动落锁（或可以设置为不自动落锁状态后），可以通过app点击，手动对锁具进行落锁操作时启用该dp点\",\"extensions\":{\"iconName\":\"icon-dp_lock\",\"attribute\":\"1280\",\"trigger\":\"direct\"},\"name\":\"手动落锁\",\"typeSpec\":{\"type\":\"bool\"}},{\"abilityId\":47,\"accessMode\":\"ro\",\"code\":\"lock_motor_state\",\"description\":\"【可选】如果锁具硬件上可以区分是否已落锁，则启用该dp。\\n1、首次配网后，上报该dp的状态值\\n2、每次状态变化时，进行dp值上报\\n3、每次app与锁具重新建立连接（ble直连的情况下），或重新连上网（带ble网关的情况下），锁具上报该dp的状态\",\"extensions\":{\"trigger\":\"direct\"},\"name\":\"落锁状态\",\"typeSpec\":{\"type\":\"bool\"}},{\"abilityId\":51,\"accessMode\":\"rw\",\"code\":\"temporary_password_creat\",\"description\":\"【可选】当支持通过app向硬件上添加指定生效时间的临时密码，则选择该dp（创建、删除、修改临时密码的dp需要同步选择）\",\"name\":\"添加临时密码\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":52,\"accessMode\":\"rw\",\"code\":\"temporary_password_delete\",\"description\":\"管理员有临时密码删除入口，联网连蓝牙状态下，可删除临时密码\",\"name\":\"删除临时密码\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":53,\"accessMode\":\"rw\",\"code\":\"temporary_password_modify\",\"description\":\"管理员有临时密码编辑入口，联网连蓝牙状态下，可编辑修改临时密码\",\"name\":\"修改临时密码\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":54,\"accessMode\":\"rw\",\"code\":\"synch_method\",\"description\":\"【具备本地电子解锁条件下 必选】当智能锁上存在物理解锁方式，包括不限于指纹、密码、卡等方式，并且可以在门锁硬件上对这些解锁方式进行操作时，需要选择该dp\\n下发同步指令，全量同步门锁下的所有开门方式（本地存储数据量较大时选用）\",\"extensions\":{\"attribute\":\"512\"},\"name\":\"同步解锁方式\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":55,\"accessMode\":\"ro\",\"code\":\"unlock_temporary\",\"description\":\"临时密码解锁记录上报\",\"extensions\":{\"attribute\":\"128\",\"trigger\":\"direct\"},\"name\":\"临时密码解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":60,\"accessMode\":\"rw\",\"code\":\"remote_no_pd_setkey\",\"description\":\"【不支持配件，支持音箱开门选该dp，与70&73互斥】\\n配置远程网络加密解锁是否开启，包含密钥（次数、时效、内容）\",\"extensions\":{\"iconName\":\"icon-setting\",\"attribute\":\"1280\"},\"name\":\"设置免密远程开门密钥\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":61,\"accessMode\":\"rw\",\"code\":\"remote_no_dp_key\",\"description\":\"远程网络解锁动作触发，下发和上报\",\"extensions\":{\"iconName\":\"icon-dp_lock\",\"attribute\":\"1280\"},\"name\":\"新免密远程开门-带密钥\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":62,\"accessMode\":\"ro\",\"code\":\"unlock_phone_remote\",\"description\":\"上报远程手机解锁的开门记录\",\"extensions\":{\"iconName\":\"icon-shouji\",\"attribute\":\"1280\",\"trigger\":\"direct\"},\"name\":\"远程手机解锁\",\"typeSpec\":{\"type\":\"value\",\"max\":999,\"min\":0,\"scale\":0,\"step\":1}},{\"abilityId\":64,\"accessMode\":\"rw\",\"code\":\"password_offline_time\",\"description\":\"离线密码时间戳下发，使用离线密码功能必选\",\"extensions\":{\"attribute\":\"128\",\"trigger\":\"direct\"},\"name\":\"离线密码T0时间下发\",\"typeSpec\":{\"type\":\"string\",\"maxlen\":255}},{\"abilityId\":65,\"accessMode\":\"ro\",\"code\":\"unlock_offline_clear_single\",\"description\":\"本地使用离线密码清除某条时间段性的离线密码后上报记录\",\"extensions\":{\"attribute\":\"128\"},\"name\":\"单条离线密码清空上报\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":66,\"accessMode\":\"ro\",\"code\":\"unlock_offline_clear\",\"description\":\"本地使用离线密码清空所有时间段的离线密码后上报记录\",\"extensions\":{\"attribute\":\"128\"},\"name\":\"离线密码清空上报\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}},{\"abilityId\":67,\"accessMode\":\"ro\",\"code\":\"unlock_offline_pd\",\"description\":\"本地使用离线密码解锁后上报记录\",\"extensions\":{\"attribute\":\"128\"},\"name\":\"离线密码解锁上报\",\"typeSpec\":{\"type\":\"raw\",\"maxlen\":128}}]}]}"
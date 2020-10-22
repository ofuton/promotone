declare namespace promotone.types {
  interface PromotionFields {
    startDatetime: kintone.fieldTypes.DateTime
    likeCount: kintone.fieldTypes.Number
    content: kintone.fieldTypes.RichText
    endDatetime: kintone.fieldTypes.DateTime

    wantToSeeUser: kintone.fieldTypes.UserSelect
    notWantToSeeGroup: kintone.fieldTypes.GroupSelect
    wantToSeeGroup: kintone.fieldTypes.GroupSelect
    notWantToSeeUser: kintone.fieldTypes.UserSelect
    likedUsers: kintone.fieldTypes.UserSelect
    notWantToSeeOrg: kintone.fieldTypes.OrganizationSelect
    wantToSeeOrg: kintone.fieldTypes.OrganizationSelect
  }
  interface SavedPromotionFields extends PromotionFields {
    $id: kintone.fieldTypes.Id
    $revision: kintone.fieldTypes.Revision
    更新者: kintone.fieldTypes.Modifier
    作成者: kintone.fieldTypes.Creator
    レコード番号: kintone.fieldTypes.RecordNumber
    更新日時: kintone.fieldTypes.UpdatedTime
    作成日時: kintone.fieldTypes.CreatedTime
  }
}

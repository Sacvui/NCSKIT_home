-- NCSStat Expert Article: TPB
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'theory-of-planned-behavior-tpb', 
    'Behavioral Research', 
    'Thuyết Hành vi Dự định (TPB): Chìa khóa vàng giải mã Ý định', 
    'Theory of Planned Behavior (TPB): Golden Key to Intentions', 
    'Hãy chú ý đến khoảng cách giữa Ý định và Hành vi. Đưa biến PBC vào như một biến điều tiết sẽ làm bài nghiên cứu sâu sắc hơn.', 
    'Focus on the Intention-Behavior gap. Use PBC as a moderator for deeper insights.', 
    $$[
        {"h2_vi":"1. Nguồn gốc từ TRA đến TPB","h2_en":"1. Evolution from TRA to TPB","content_vi":"Icek Ajzen (1991) đã phát triển TPB bằng cách thêm vào biến Kiểm soát hành vi cảm nhận (PBC) để giải thích các hành vi mà cá nhân không hoàn toàn tự chủ được.","content_en":"Ajzen (1991) added PBC to TRA to account for behaviors not fully under volitional control."},
        {"h2_vi":"2. Ba trụ cột của Ý định","h2_en":"2. Three Pillars of Intention","content_vi":"- Thái độ (Attitude): Đánh giá tốt/xấu.\n- Chuẩn chủ quan (Subjective Norm): Áp lực xã hội.\n- PBC: Niềm tin vào khả năng thực hiện.","content_en":"- Attitude: Evaluation.\n- Subjective Norm: Social pressure.\n- PBC: Ability belief."},
        {"h2_vi":"3. Ứng dụng thực tiễn trên ncsStat","h2_en":"3. ncsStat Application","content_vi":"Sử dụng phân tích hồi quy đa biến để đo lường mức độ tác động của 3 nhân tố này lên Ý định hành vi. Chú ý hiện tượng đa cộng tuyến.","content_en":"Use multiple regression to measure impacts on Intention. Monitor VIF carefully."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

package com.hms.user.repository;

import com.hms.user.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    Optional<UserProfile> findByAuthId(Long authId);
    List<UserProfile> findByHostelId(Long hostelId);
    List<UserProfile> findByRole(UserProfile.Role role);
    Page<UserProfile> findByHostelId(Long hostelId, Pageable pageable);

    @Query("SELECT u FROM UserProfile u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<UserProfile> searchUsers(String search, Pageable pageable);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    long countByHostelIdAndRole(Long hostelId, UserProfile.Role role);
}

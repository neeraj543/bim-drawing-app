package com.bim.backend.config;

import com.bim.backend.entity.User;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Task;
import com.bim.backend.entity.Offerte;
import com.bim.backend.repository.UserRepository;
import com.bim.backend.repository.ProjectRepository;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.TaskRepository;
import com.bim.backend.repository.OfferteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            DrawingSetRepository drawingSetRepository,
            TaskRepository taskRepository,
            OfferteRepository offerteRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin user
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .email("admin@bim.local")
                        .fullName("Administrator")
                        .role(User.Role.ADMIN)
                        .build();

                userRepository.save(adminUser);
                System.out.println("✓ Admin user created");
            } else {
                System.out.println("✓ Admin user already exists");
            }

            // Create test user 1
            if (!userRepository.existsByUsername("john")) {
                User user1 = User.builder()
                        .username("john")
                        .password(passwordEncoder.encode("password123"))
                        .email("john@bim.local")
                        .fullName("John Smith")
                        .role(User.Role.USER)
                        .build();

                userRepository.save(user1);
                System.out.println("✓ Test user 'john' created");
            }

            // Create test user 2
            if (!userRepository.existsByUsername("sarah")) {
                User user2 = User.builder()
                        .username("sarah")
                        .password(passwordEncoder.encode("password123"))
                        .email("sarah@bim.local")
                        .fullName("Sarah Johnson")
                        .role(User.Role.USER)
                        .build();

                userRepository.save(user2);
                System.out.println("✓ Test user created (username: sarah, password: password123)");
            }

            // Create sample projects, drawing sets, and tasks
            User admin = userRepository.findByUsername("admin").orElse(null);
            User john = userRepository.findByUsername("john").orElse(null);
            User sarah = userRepository.findByUsername("sarah").orElse(null);

            if (admin != null && john != null && sarah != null && projectRepository.count() == 0) {
                System.out.println("\n📦 Creating sample data...\n");

                // Project 1: Office Building
                Project officeProject = Project.builder()
                        .name("Downtown Office Tower")
                        .projectNumber("BIM-2025-001")
                        .projectName("Downtown Office Tower Development")
                        .description("12-story commercial office building in downtown area")
                        .owner(admin)
                        .build();
                officeProject = projectRepository.save(officeProject);
                System.out.println("✓ Project created: " + officeProject.getName());

                // Drawing Set 1 for Office Building
                DrawingSet officeSet1 = DrawingSet.builder()
                        .name("Architectural - Foundation & Ground Floor")
                        .description("Foundation plans and ground floor layout")
                        .revisionNumber("Rev A")
                        .project(officeProject)
                        .isLatest(true)
                        .build();
                officeSet1 = drawingSetRepository.save(officeSet1);
                System.out.println("  ✓ Drawing set created: " + officeSet1.getName());

                // Drawing Set 2 for Office Building
                DrawingSet officeSet2 = DrawingSet.builder()
                        .name("Structural - Steel Framing")
                        .description("Steel frame structural details for floors 1-6")
                        .revisionNumber("Rev A")
                        .project(officeProject)
                        .isLatest(true)
                        .build();
                officeSet2 = drawingSetRepository.save(officeSet2);
                System.out.println("  ✓ Drawing set created: " + officeSet2.getName());

                // Project 2: Residential Complex
                Project residentialProject = Project.builder()
                        .name("Riverside Apartments")
                        .projectNumber("BIM-2025-002")
                        .projectName("Riverside Luxury Apartments")
                        .description("4-building residential complex with 120 units")
                        .owner(admin)
                        .build();
                residentialProject = projectRepository.save(residentialProject);
                System.out.println("✓ Project created: " + residentialProject.getName());

                // Drawing Set 1 for Residential
                DrawingSet residentialSet1 = DrawingSet.builder()
                        .name("MEP - HVAC Systems")
                        .description("HVAC layout and ductwork for Building A")
                        .revisionNumber("Rev B")
                        .project(residentialProject)
                        .isLatest(true)
                        .build();
                residentialSet1 = drawingSetRepository.save(residentialSet1);
                System.out.println("  ✓ Drawing set created: " + residentialSet1.getName());

                // Project 3: Hospital Expansion
                Project hospitalProject = Project.builder()
                        .name("City Hospital - East Wing")
                        .projectNumber("BIM-2024-087")
                        .projectName("City Hospital East Wing Expansion")
                        .description("New 5-story medical wing with emergency department")
                        .owner(admin)
                        .build();
                hospitalProject = projectRepository.save(hospitalProject);
                System.out.println("✓ Project created: " + hospitalProject.getName());

                // Drawing Set 1 for Hospital
                DrawingSet hospitalSet1 = DrawingSet.builder()
                        .name("Architectural - Emergency Department")
                        .description("Emergency department layout and patient flow diagrams")
                        .revisionNumber("Rev C")
                        .project(hospitalProject)
                        .isLatest(false)
                        .build();
                hospitalSet1 = drawingSetRepository.save(hospitalSet1);
                System.out.println("  ✓ Drawing set created: " + hospitalSet1.getName());

                // Drawing Set 2 for Hospital (Latest revision)
                DrawingSet hospitalSet2 = DrawingSet.builder()
                        .name("Architectural - Emergency Department")
                        .description("Emergency department layout with updated infection control zones")
                        .revisionNumber("Rev D")
                        .project(hospitalProject)
                        .isLatest(true)
                        .build();
                hospitalSet2 = drawingSetRepository.save(hospitalSet2);
                System.out.println("  ✓ Drawing set created: " + hospitalSet2.getName());

                System.out.println("\n📋 Creating sample tasks...\n");

                // Tasks for John
                Task task1 = Task.builder()
                        .title("Review foundation details")
                        .description("Review foundation and footing details for compliance with structural calculations")
                        .status(Task.TaskStatus.IN_PROGRESS)
                        .priority(Task.Priority.HIGH)
                        .dueDate(LocalDate.now().plusDays(3))
                        .drawingSet(officeSet1)
                        .assignedUser(john)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task1);
                System.out.println("✓ Task assigned to John: " + task1.getTitle());

                Task task2 = Task.builder()
                        .title("Update HVAC ductwork routing")
                        .description("Revise HVAC ductwork to avoid structural beam conflicts in units 101-110")
                        .status(Task.TaskStatus.TO_DO)
                        .priority(Task.Priority.MEDIUM)
                        .dueDate(LocalDate.now().plusDays(7))
                        .drawingSet(residentialSet1)
                        .assignedUser(john)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task2);
                System.out.println("✓ Task assigned to John: " + task2.getTitle());

                Task task3 = Task.builder()
                        .title("Complete steel connection details")
                        .description("Finalize moment connection details for columns C12-C24")
                        .status(Task.TaskStatus.DONE)
                        .priority(Task.Priority.HIGH)
                        .dueDate(LocalDate.now().minusDays(2))
                        .drawingSet(officeSet2)
                        .assignedUser(john)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task3);
                System.out.println("✓ Task assigned to John: " + task3.getTitle());

                // Tasks for Sarah
                Task task4 = Task.builder()
                        .title("Add infection control zones to ED layout")
                        .description("Update emergency department layout with new infection control zoning per CDC guidelines")
                        .status(Task.TaskStatus.IN_PROGRESS)
                        .priority(Task.Priority.HIGH)
                        .dueDate(LocalDate.now().plusDays(2))
                        .drawingSet(hospitalSet2)
                        .assignedUser(sarah)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task4);
                System.out.println("✓ Task assigned to Sarah: " + task4.getTitle());

                Task task5 = Task.builder()
                        .title("Coordinate plumbing risers with architecture")
                        .description("Verify plumbing riser locations don't conflict with apartment layouts")
                        .status(Task.TaskStatus.TO_DO)
                        .priority(Task.Priority.MEDIUM)
                        .dueDate(LocalDate.now().plusDays(5))
                        .drawingSet(residentialSet1)
                        .assignedUser(sarah)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task5);
                System.out.println("✓ Task assigned to Sarah: " + task5.getTitle());

                Task task6 = Task.builder()
                        .title("Review ground floor accessibility compliance")
                        .description("Verify all accessibility requirements (ADA) are met in ground floor layout")
                        .status(Task.TaskStatus.TO_DO)
                        .priority(Task.Priority.LOW)
                        .dueDate(LocalDate.now().plusDays(10))
                        .drawingSet(officeSet1)
                        .assignedUser(sarah)
                        .createdBy(admin)
                        .build();
                taskRepository.save(task6);
                System.out.println("✓ Task assigned to Sarah: " + task6.getTitle());

                System.out.println("\n✅ Sample data creation completed!\n");
            }

            // Sample offertes
            if (offerteRepository.count() == 0) {
                User adminUser = userRepository.findByUsername("admin").orElse(null);

                offerteRepository.save(Offerte.builder()
                        .offerteNumber("001/2025")
                        .date(LocalDate.of(2025, 3, 10))
                        .preparedBy("Emiel")
                        .projectDescription("Woningen Geel")
                        .submissionDeadline(LocalDate.of(2025, 3, 25))
                        .status(Offerte.OfferteStatus.ACCEPTED)
                        .clientName("Bouwbedrijf Janssen NV")
                        .clientStreet("Industrielaan")
                        .clientStreetNumber("42")
                        .clientPostcode("2440")
                        .clientCity("Geel")
                        .clientVatNumber("BE0123456789")
                        .siteAddress("Herentalseweg 12, 2440 Geel")
                        .finishGrade("Structuur")
                        .projectType("Particulier")
                        .numberOfUnits(4)
                        .buildingDimensions("12m × 9m")
                        .numberOfFloors(2)
                        .roofType("Zadeldak")
                        .roofPitch("35°")
                        .corniceHeight("5.40m")
                        .ridgeHeight("8.20m")
                        .ceilingHeightGelijkvloers("2.60m")
                        .ceilingHeightVerdiep1("2.40m")
                        .cltM2(new java.math.BigDecimal("320.00"))
                        .cltPricePerM2(new java.math.BigDecimal("85.00"))
                        .glColumnsM3(new java.math.BigDecimal("12.50"))
                        .glColumnsPricePerM3(new java.math.BigDecimal("1200.00"))
                        .glBeamsM3(new java.math.BigDecimal("8.20"))
                        .glBeamsPricePerM3(new java.math.BigDecimal("1100.00"))
                        .includeRoostring(true)
                        .roosteringM2(new java.math.BigDecimal("280.00"))
                        .roosteringPricePerM2(new java.math.BigDecimal("22.00"))
                        .numberOfTrucks(3)
                        .createdBy(adminUser)
                        .build());

                offerteRepository.save(Offerte.builder()
                        .offerteNumber("002/2025")
                        .date(LocalDate.of(2025, 5, 2))
                        .preparedBy("Emiel")
                        .projectDescription("Kantoorgebouw Antwerpen")
                        .submissionDeadline(LocalDate.of(2025, 5, 20))
                        .status(Offerte.OfferteStatus.PENDING)
                        .clientName("Construx BV")
                        .clientStreet("Kasteelpleinstraat")
                        .clientStreetNumber("7")
                        .clientPostcode("2000")
                        .clientCity("Antwerpen")
                        .clientVatNumber("BE0987654321")
                        .siteAddress("Havenlaan 55, 2030 Antwerpen")
                        .finishGrade("Structuur")
                        .projectType("Commercieel")
                        .numberOfUnits(1)
                        .buildingDimensions("20m × 15m")
                        .numberOfFloors(3)
                        .roofType("Plat dak")
                        .corniceHeight("9.60m")
                        .ceilingHeightGelijkvloers("3.20m")
                        .ceilingHeightVerdiep1("3.00m")
                        .cltM2(new java.math.BigDecimal("580.00"))
                        .cltPricePerM2(new java.math.BigDecimal("90.00"))
                        .glColumnsM3(new java.math.BigDecimal("24.00"))
                        .glColumnsPricePerM3(new java.math.BigDecimal("1250.00"))
                        .glBeamsM3(new java.math.BigDecimal("18.50"))
                        .glBeamsPricePerM3(new java.math.BigDecimal("1150.00"))
                        .includeRoostring(false)
                        .numberOfTrucks(5)
                        .createdBy(adminUser)
                        .build());

                offerteRepository.save(Offerte.builder()
                        .offerteNumber("003/2025")
                        .date(LocalDate.of(2025, 6, 15))
                        .preparedBy("Emiel")
                        .projectDescription("Vakantiewoning Ardennes")
                        .submissionDeadline(LocalDate.of(2025, 7, 1))
                        .status(Offerte.OfferteStatus.DRAFT)
                        .clientName("Familie Dubois")
                        .clientStreet("Rue de la Forêt")
                        .clientStreetNumber("3")
                        .clientPostcode("6800")
                        .clientCity("Libramont")
                        .siteAddress("Chemin des Bois 8, 6800 Libramont")
                        .finishGrade("Structuur")
                        .projectType("Particulier")
                        .numberOfUnits(1)
                        .buildingDimensions("10m × 7m")
                        .numberOfFloors(1)
                        .roofType("Zadeldak")
                        .roofPitch("40°")
                        .corniceHeight("3.20m")
                        .ridgeHeight("6.10m")
                        .ceilingHeightGelijkvloers("2.60m")
                        .cltM2(new java.math.BigDecimal("140.00"))
                        .cltPricePerM2(new java.math.BigDecimal("88.00"))
                        .glColumnsM3(new java.math.BigDecimal("4.50"))
                        .glColumnsPricePerM3(new java.math.BigDecimal("1200.00"))
                        .glBeamsM3(new java.math.BigDecimal("3.00"))
                        .glBeamsPricePerM3(new java.math.BigDecimal("1100.00"))
                        .includeRoostring(false)
                        .numberOfTrucks(1)
                        .createdBy(adminUser)
                        .build());

                System.out.println("✓ Sample offertes created");
            }
        };
    }
}